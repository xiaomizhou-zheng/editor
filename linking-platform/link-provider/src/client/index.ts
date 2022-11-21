// import setimmediate to temporary fix dataloader 2.0.0 bug
// @see https://github.com/graphql/dataloader/issues/249
import 'setimmediate';
import DataLoader from 'dataloader';
import { JsonLd } from 'json-ld-types';
import retry, { Options } from 'async-retry';
import pThrottle from 'p-throttle';
import {
  InvokePayload,
  APIError,
  InvocationSearchPayload,
} from '@atlaskit/linking-common';
import * as api from './api';
import { CardClient as CardClientInterface, EnvironmentsKeys } from './types';
import { getResolverUrl } from './utils/environments';
import {
  BatchResponse,
  SuccessResponse,
  ErrorResponse,
  isSuccessfulResponse,
  isErrorResponse,
  SearchProviderInfoResponse,
} from './types/responses';
import { InvokeRequest } from './types/requests';
import { getStatus } from '../helpers';
import { LRUCache } from 'lru-fast/lru';

const MAX_BATCH_SIZE = 50;
const MIN_TIME_BETWEEN_BATCHES = 250;
const URL_RESPONSE_CACHE_SIZE = 100;

// Contains cached mapping between url and a promise of a response.
// Note that promise can be either unsettled/ongoing OR successfully resolved (not an error or non-resolved)
export const urlResponsePromiseCache = new LRUCache<
  string,
  Promise<SuccessResponse | ErrorResponse>
>(URL_RESPONSE_CACHE_SIZE);

export default class CardClient implements CardClientInterface {
  private resolverUrl: string;
  private loadersByDomain: Record<
    string,
    DataLoader<string, SuccessResponse | ErrorResponse>
  >;
  private retryConfig: Options;
  private resolvedCache: Record<string, boolean>;

  constructor(envKey?: EnvironmentsKeys, baseUrlOverride?: string) {
    this.resolverUrl = getResolverUrl(envKey, baseUrlOverride);
    this.loadersByDomain = {};
    this.retryConfig = {
      retries: 2,
    };
    this.resolvedCache = {};
  }

  private batchResolve = async (
    urls: ReadonlyArray<string>,
  ): Promise<BatchResponse> => {
    // De-duplicate requested URLs (see `this.createLoader` for more detail).
    const deDuplicatedUrls = [...new Set(urls)];
    let resolvedUrls: BatchResponse = [];

    try {
      // Ask the backend to resolve the URLs for us.
      resolvedUrls = await api.request<BatchResponse>(
        'post',
        `${this.resolverUrl}/resolve/batch`,
        deDuplicatedUrls.map(resourceUrl => ({ resourceUrl })),
      );
    } catch (error) {
      // we make sure we return a valid dataloader response by creating an error
      // response for each url
      resolvedUrls = urls.map(() => {
        // @ts-expect-error
        const status = isErrorResponse(error) ? error.status : 500;
        const errorResponse: ErrorResponse = {
          status,
          // @ts-expect-error
          error,
        };
        return errorResponse;
      });
    }

    // Reduce into a map to make accessing faster and easier.
    const map: Record<string, SuccessResponse | ErrorResponse> = {};
    // NOTE: the batch endpoint returns the URLs in the same order they were given.
    for (let i = 0; i < deDuplicatedUrls.length; ++i) {
      const url = deDuplicatedUrls[i];
      const data = resolvedUrls[i];
      map[url] = data;
    }

    // Reconvert list back into the original order in which it was given to us.
    return urls.map(originalUrl => map[originalUrl]);
  };

  private createLoader() {
    const batchResolveThrottler = pThrottle({
      limit: 1,
      interval: MIN_TIME_BETWEEN_BATCHES,
    });
    const throttledBatchResolve = batchResolveThrottler(this.batchResolve);

    return new DataLoader(
      // We place all calls to `batchResolve` in a limiter so we don't send off several simultaneous batch requests.
      // This is for two reasons:
      //  1: we want to avoid getting rate limited upstream (eg: forge and other APIs)
      //  2: we want to avoid sending out heaps of requests from the client at once
      (urls: ReadonlyArray<string>) => throttledBatchResolve(urls),
      {
        maxBatchSize: MAX_BATCH_SIZE,
        // NOTE: we turn off DataLoader's cache because it doesn't work for our use-case. Consider the following:
        // - a smartlink to a restricted item is resolved to "forbidden" with a "request access button"
        // - the user clicks "request access", and then following the auth prompts and gets access
        // - the frontend now re-renders the smartlink, but due to DataLoader's caching, the previous "forbidden" state is
        //   because the smartlink's URL (which is the cache key) is exactly the same
        //
        // For this reason, we disable DataLoader's cache.
        // This means that URLs will not be de-duplicated by DataLoader, so we perform the de-duplication logic
        // ourselves in `this.batchResolve`.
        cache: false,
      },
    );
  }

  private getLoader(hostname: string) {
    if (!this.loadersByDomain[hostname]) {
      this.loadersByDomain[hostname] = this.createLoader();
    }

    return this.loadersByDomain[hostname];
  }

  public async prefetchData(url: string): Promise<JsonLd.Response | undefined> {
    // 1. Queue the URL as part of a dataloader batch.
    const hostname = new URL(url).hostname;
    const loader = this.getLoader(hostname);
    const response = await loader.load(url);

    if (isSuccessfulResponse(response)) {
      // 2. If the URL resolves, send it back.
      return response.body;
    } else {
      try {
        // 3. If the URL does not resolve, retry it with exponential backoff.
        // This is done so that we avoid the scenario where users are unable to
        // see a resolved Smart Link, when their expectation is to be able to.
        const retriedResponse = await retry(async () => {
          // We check if the link has resolved in the cache and stop trying if so.
          // We do this by triggering an error that the link has already been resolved.
          // This cascades <retryCount> times after which it is handled like a normal
          // 'error', returning `undefined`.
          if (!this.resolvedCache[url]) {
            const response = await loader.load(url);
            if (isSuccessfulResponse(response)) {
              return response;
            } else {
              throw new Error('Retry for URL failed');
            }
          } else {
            // Short-circuit each of the retries, as described above.
            throw new Error('Retry unneeded - link has been resolved.');
          }
        }, this.retryConfig);
        // Trigger callback after successful backoff.
        return retriedResponse.body;
      } catch (err) {
        // Do nothing in the case of an error - prefetching
        // failures should be silent. Once a link is visible,
        // it will be re-fetched anyhow, in which case a
        // user-facing error is required.
        return undefined;
      }
    }
  }

  public async fetchData(url: string): Promise<JsonLd.Response> {
    const hostname = new URL(url).hostname;
    const loader = this.getLoader(hostname);
    let responsePromise: Promise<SuccessResponse | ErrorResponse> | undefined;

    responsePromise = urlResponsePromiseCache.get(url);
    if (!responsePromise) {
      responsePromise = loader.load(url);
      urlResponsePromiseCache.put(url, responsePromise);
    }

    let response: SuccessResponse | ErrorResponse;
    try {
      response = await responsePromise;
    } catch (e) {
      // Technically this never happens, since batchResolve handles errors and doesn't throw,
      // But just in case.
      urlResponsePromiseCache.remove(url);
      throw e;
    }

    const isUnresolvedLink =
      !isSuccessfulResponse(response) ||
      getStatus(response.body) !== 'resolved';
    if (isUnresolvedLink) {
      // We want consequent calls for fetchData() to cause actual http call
      urlResponsePromiseCache.remove(url);
    }

    if (!isSuccessfulResponse(response)) {
      throw this.mapErrorResponse(response, hostname);
    }
    // Set a flag in the `resolvedCache` for this URL. The intent of this is
    // to ensure that the exponential backoff method in `prefetchData` does
    // not continue to retry fetching for this URL, especially if it was previously
    // in a failed state. Note: this scenario only occurs on initial page load, if the
    // user scrolls through the page very fast. Once the URL is visible, prefetching
    // no longer takes place.
    this.resolvedCache[url] = true;
    // Return the JSON-LD response back up!
    return response.body;
  }

  public async postData(
    data: InvokePayload<InvokeRequest>,
  ): Promise<JsonLd.Response> {
    const request = {
      key: data.key,
      action: data.action,
      context: data.context,
    };
    return await api.request('post', `${this.resolverUrl}/invoke`, request);
  }

  /**
   * Make request to the Search endpoint See `InvocationRequest` in ORS openapi.yaml for backend
   * spec.
   * @param data Payload including the search provider key and query. An empty search query string
   * results in recent results being returned (pre-query).
   * @returns JsonLd collection of search results.
   */
  public async search(
    data: InvokePayload<InvocationSearchPayload>,
  ): Promise<JsonLd.Collection> {
    const { key, action } = data;
    // Note: context in action is different to context in data, see types.
    const { query, context } = action;
    const request = {
      key,
      search: {
        query,
        context,
      },
    };
    const response = await api.request<ErrorResponse | JsonLd.Collection>(
      'post',
      `${this.resolverUrl}/invoke/search`,
      request,
    );
    if (isErrorResponse(response)) {
      // There is no hostname/it is not known. Hostname is not logged anyway as it's considered PII.
      throw this.mapErrorResponse(response);
    }
    return response;
  }

  public async fetchAvailableSearchProviders() {
    const response = await api.request<SearchProviderInfoResponse>(
      'post',
      `${this.resolverUrl}/providers`,
      { type: 'search' },
    );

    return response.providers;
  }

  private mapErrorResponse(response: ErrorResponse, hostname: string = '') {
    // Catch non-200 server responses to fallback or return useful information.
    if (response.error) {
      const errorType = response.error.type;
      const errorMessage = response.error.message;
      // this means there was a network error and we fallback to blue link
      // without impacting SLO's
      if (response.error instanceof api.NetworkError) {
        return new APIError('fallback', hostname, errorMessage, errorType);
      }

      switch (errorType) {
        // BadRequestError - indicative of an API error, render
        // a blue link to mitigate customer impact.
        case 'ResolveBadRequestError':
        case 'SearchBadRequestError':
          return new APIError('fallback', hostname, errorMessage, errorType);
        // AuthError - if the user logs in, we may be able
        // to recover. Render an unauthorized card.
        case 'ResolveAuthError':
        case 'SearchAuthError':
          return new APIError('auth', hostname, errorMessage, errorType);
        // UnsupportedError - we do not know how to render this URL.
        // Bail out and ask the Editor to render as a blue link.
        case 'ResolveUnsupportedError': // URL isn't supported
        case 'SearchUnsupportedError': // Search isn't supported
          return new APIError('fatal', hostname, errorMessage, errorType);
        case 'ResolveFailedError': // Failed
        case 'SearchFailedError':
        case 'ResolveTimeoutError': // Timeouts
        case 'SearchTimeoutError':
        case 'SearchRateLimitError': //Rate Limit Error
        case 'InternalServerError': // ORS failures
          return new APIError('error', hostname, errorMessage, errorType);
      }
    }
    // Catch all: we don't know this error, bail out.
    return new APIError(
      'fatal',
      hostname,
      JSON.stringify(response),
      'UnexpectedError',
    );
  }
}
