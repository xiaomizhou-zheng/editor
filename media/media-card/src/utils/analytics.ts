import {
  FileDetails,
  FileStatus,
  MediaClientErrorReason,
  getMediaClientErrorReason,
  RequestMetadata,
  isRequestError,
} from '@atlaskit/media-client';
import {
  ANALYTICS_MEDIA_CHANNEL,
  FileAttributes,
  PerformanceAttributes,
  OperationalEventPayload,
  UIEventPayload,
  WithFileAttributes,
  WithPerformanceAttributes,
  SuccessAttributes,
  FailureAttributes,
  ScreenEventPayload,
  ScreenAttributes,
  filterFeatureFlagNames,
  filterFeatureFlagKeysAllProducts,
  MediaTraceContext,
  WithTraceContext,
} from '@atlaskit/media-common';
import {
  CreateUIAnalyticsEvent,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  isMediaCardError,
  MediaCardError,
  MediaCardErrorPrimaryReason,
} from '../errors';
import { CardPreviewSource, CardDimensions } from '../types';

const relevantFlags = {
  newCardExperience: true,
  captions: true,
  timestampOnVideo: true,
  observedWidth: true,
  mediaInline: false,
  folderUploads: false,
  mediaUploadApiV2: true,
  memoryCacheLogging: true,
};

export type CardPreviewAttributes = {
  fileId: string;
  prevDimensions: CardDimensions | undefined;
  currentDimensions: CardDimensions | undefined;
  dimensionsPercentageDiff?: CardDimensions | undefined;
  source: CardPreviewSource;
};

type WithCardPreviewCacheAttributes = {
  cardPreviewAttributes: CardPreviewAttributes;
};

export const LOGGED_FEATURE_FLAGS = filterFeatureFlagNames(relevantFlags);

export const LOGGED_FEATURE_FLAG_KEYS = filterFeatureFlagKeysAllProducts(
  relevantFlags,
);

export type FileUriFailReason = 'local-uri' | 'remote-uri' | `unknown-uri`;
export type FailedErrorFailReason = MediaCardErrorPrimaryReason | 'nativeError';

export type MediaCardErrorInfo = {
  failReason: FailedErrorFailReason;
  error: MediaClientErrorReason | 'nativeError';
  errorDetail: string;
};

export type SSRStatusFail = MediaCardErrorInfo & {
  status: 'fail';
};

type SSRStatusSuccess = SuccessAttributes;

type SSRStatusUnknown = { status: 'unknown' };

type SSRStatusAttributes = SSRStatusSuccess | SSRStatusFail | SSRStatusUnknown;

export type SSRStatus = {
  server: SSRStatusAttributes;
  client: SSRStatusAttributes;
};

export type WithSSRReliability = {
  ssrReliability?: SSRStatus;
};

export type RenderFailedEventPayload = OperationalEventPayload<
  WithFileAttributes &
    WithPerformanceAttributes &
    WithSSRReliability &
    WithTraceContext &
    FailureAttributes & {
      failReason: FailedErrorFailReason | 'failed-processing';
      error?: MediaClientErrorReason | 'nativeError';
      request?: RequestMetadata;
    },
  'failed',
  'mediaCardRender'
>;

export type RenderSucceededEventPayload = OperationalEventPayload<
  WithFileAttributes &
    WithPerformanceAttributes &
    WithSSRReliability &
    SuccessAttributes &
    WithTraceContext,
  'succeeded',
  'mediaCardRender'
>;

export type RenderCommencedEventPayload = OperationalEventPayload<
  WithFileAttributes & WithPerformanceAttributes & WithTraceContext,
  'commenced',
  'mediaCardRender'
>;

export type CacheHitEventPayload = OperationalEventPayload<
  WithCardPreviewCacheAttributes,
  'cache-hit',
  'mediaCardCache'
>;

export type RemoteSuccessEventPayload = OperationalEventPayload<
  WithCardPreviewCacheAttributes,
  'Remote-success',
  'mediaCardCache'
>;

export type CopiedFileEventPayload = UIEventPayload<{}, 'copied', string>;

export type ClickedEventPayload = UIEventPayload<
  { label?: string },
  'clicked',
  string
>;

export type RenderScreenEventPayload = Omit<
  ScreenEventPayload<ScreenAttributes, 'mediaCardRenderScreen'>,
  'attributes'
> & {
  attributes: {
    type: string | undefined;
    fileAttributes: FileAttributes;
  };
};

export type MediaCardAnalyticsEventPayload =
  | RenderCommencedEventPayload
  | RenderSucceededEventPayload
  | RenderFailedEventPayload
  | CopiedFileEventPayload
  | ClickedEventPayload
  | RenderScreenEventPayload
  | CacheHitEventPayload
  | RemoteSuccessEventPayload;

export const getFileAttributes = (
  metadata: FileDetails,
  fileStatus?: FileStatus,
): FileAttributes => ({
  fileMediatype: metadata.mediaType,
  fileMimetype: metadata.mimeType,
  fileId: metadata.id,
  fileSize: metadata.size,
  fileStatus,
});

export const getRenderPreviewableCardPayload = (
  fileAttributes: FileAttributes,
): RenderScreenEventPayload => ({
  eventType: 'screen',
  action: 'viewed',
  actionSubject: 'mediaCardRenderScreen',
  name: 'mediaCardRenderScreen',
  attributes: {
    type: fileAttributes.fileMediatype,
    fileAttributes,
  },
});

export const getRenderCommencedEventPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  traceContext: MediaTraceContext,
): RenderCommencedEventPayload => {
  return {
    eventType: 'operational',
    action: 'commenced',
    actionSubject: 'mediaCardRender',
    attributes: {
      fileAttributes,
      performanceAttributes,
      traceContext: {
        traceId: traceContext.traceId,
      },
    },
  };
};

export const getRenderSucceededEventPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  ssrReliability: SSRStatus,
  traceContext: MediaTraceContext,
): RenderSucceededEventPayload => ({
  eventType: 'operational',
  action: 'succeeded',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'success',
    ssrReliability,
    traceContext,
  },
});

export const getCacheHitEventPayload = (
  cardPreviewAttributes: CardPreviewAttributes,
): CacheHitEventPayload => ({
  eventType: 'operational',
  action: 'cache-hit',
  actionSubject: 'mediaCardCache',
  attributes: {
    cardPreviewAttributes,
  },
});

export const getRemoteSuccessEventPayload = (
  cardPreviewAttributes: CardPreviewAttributes,
): RemoteSuccessEventPayload => ({
  eventType: 'operational',
  action: 'Remote-success',
  actionSubject: 'mediaCardCache',
  attributes: {
    cardPreviewAttributes,
  },
});

export const getRenderFailedExternalUriPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: 'failed',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'fail',
    failReason: 'external-uri',
  },
});

export const getRenderErrorFailReason = (
  error: MediaCardError,
): FailedErrorFailReason => {
  if (isMediaCardError(error)) {
    return error.primaryReason;
  } else {
    return 'nativeError';
  }
};

export const getRenderErrorErrorReason = (
  error: MediaCardError,
): MediaClientErrorReason | 'nativeError' => {
  if (isMediaCardError(error) && error.secondaryError) {
    const mediaClientReason = getMediaClientErrorReason(error.secondaryError);
    if (mediaClientReason !== 'unknown') {
      return mediaClientReason;
    }
  }
  return 'nativeError';
};

export const getRenderErrorErrorDetail = (error: MediaCardError): string => {
  if (isMediaCardError(error) && error.secondaryError) {
    return error.secondaryError.message;
  } else {
    return error.message;
  }
};

export const getRenderErrorRequestMetadata = (
  error: MediaCardError,
): RequestMetadata | undefined => {
  if (
    isMediaCardError(error) &&
    !!error.secondaryError &&
    isRequestError(error.secondaryError)
  ) {
    return error.secondaryError.metadata;
  }
};

export const extractErrorInfo = (error: MediaCardError): MediaCardErrorInfo => {
  return {
    failReason: getRenderErrorFailReason(error),
    error: getRenderErrorErrorReason(error),
    errorDetail: getRenderErrorErrorDetail(error),
  };
};

export const getRenderErrorEventPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  error: MediaCardError,
  ssrReliability: SSRStatus,
  traceContext: MediaTraceContext,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: 'failed',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'fail',
    ...extractErrorInfo(error),
    request: getRenderErrorRequestMetadata(error),
    ssrReliability,
    traceContext,
  },
});

export const getRenderFailedFileStatusPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  ssrReliability: SSRStatus,
  traceContext: MediaTraceContext,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: 'failed',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'fail',
    failReason: 'failed-processing',
    ssrReliability,
    traceContext,
  },
});

export const getCopiedFilePayload = (
  fileId: string,
): CopiedFileEventPayload => ({
  eventType: 'ui',
  action: 'copied',
  actionSubject: 'file',
  actionSubjectId: fileId,
  attributes: {},
});

export function fireMediaCardEvent(
  payload: MediaCardAnalyticsEventPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent(payload);
    event.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}

export const createAndFireMediaCardEvent = (
  payload: MediaCardAnalyticsEventPayload,
) => {
  return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(payload);
};
