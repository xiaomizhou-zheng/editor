import { JsonLd } from 'json-ld-types';

import { IconType, SmartLinkStatus } from '../../../constants';
import { getContextByStatus, getRetryOptions } from '../utils';
import { messages } from '../../../messages';

describe('getContextByStatus', () => {
  const url = 'some-url';

  it('return context for Pending status', () => {
    const context = getContextByStatus(url, SmartLinkStatus.Pending);

    expect(context).toEqual({ title: url, url });
  });

  it('return context for Resolving status', () => {
    const context = getContextByStatus(url, SmartLinkStatus.Resolving);

    expect(context).toEqual({ title: url, url });
  });

  it('return context for Resolved status', () => {
    const context = getContextByStatus(url, SmartLinkStatus.Resolved, {
      meta: {
        auth: [],
        definitionId: 'confluence-object-provider',
        visibility: 'restricted',
        access: 'granted',
        resourceType: 'page',
        key: 'confluence-object-provider',
      },
      data: {
        '@context': {
          '@vocab': 'https://www.w3.org/ns/activitystreams#',
          atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
          schema: 'http://schema.org/',
        },
        generator: {
          '@type': 'Application',
          '@id': 'https://www.atlassian.com/#Confluence',
          name: 'Confluence',
        },
        '@type': ['Document', 'schema:TextDigitalDocument'],
        url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
        name: 'Everything you need to know about ShipIt53!',
        summary: 'ShipIt 53 is on 9 Dec 2021 and 10 Dec 2021!',
      },
    });

    expect(context).toEqual({
      linkIcon: {
        icon: 'FileType:Document',
        label: 'Everything you need to know about ShipIt53!',
      },
      title: 'Everything you need to know about ShipIt53!',
      snippet: 'ShipIt 53 is on 9 Dec 2021 and 10 Dec 2021!',
      url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
      provider: {
        label: 'Confluence',
        icon: 'Provider:Confluence',
      },
    });
  });

  it('return context for Unauthorized status', () => {
    const context = getContextByStatus(url, SmartLinkStatus.Unauthorized);

    expect(context).toEqual({
      linkIcon: { icon: IconType.Forbidden },
      title: url,
      url,
    });
  });

  it('return context for Forbidden status', () => {
    const context = getContextByStatus(url, SmartLinkStatus.Forbidden);

    expect(context).toEqual({
      linkIcon: { icon: IconType.Forbidden },
      title: url,
      url,
    });
  });

  it('return context for NotFound status', () => {
    const context = getContextByStatus(url, SmartLinkStatus.NotFound);

    expect(context).toEqual({
      linkIcon: { icon: IconType.Error },
      title: url,
      url,
    });
  });

  it('return context for Errored status', () => {
    const context = getContextByStatus(url, SmartLinkStatus.Errored);

    expect(context).toEqual({
      linkIcon: { icon: IconType.Default },
      title: url,
      url,
    });
  });

  it('return context for Fallback status', () => {
    const context = getContextByStatus(url, SmartLinkStatus.Fallback);

    expect(context).toEqual({
      linkIcon: { icon: IconType.Default },
      title: url,
      url,
    });
  });
});

describe('getRetryOptions', () => {
  const url = 'some-url';

  describe('Forbidden status', () => {
    const response = (accessType?: string) =>
      (({
        meta: {
          access: 'forbidden',
          visibility: 'restricted',
          requestAccess: { accessType },
        },
      } as unknown) as JsonLd.Response);

    it('return default retry option', () => {
      const retry = getRetryOptions(url, SmartLinkStatus.Forbidden, response());

      expect(retry).toEqual({
        descriptor: messages.restricted_link,
      });
    });

    it('return retry option for DIRECT_ACCESS', () => {
      const retry = getRetryOptions(
        url,
        SmartLinkStatus.Forbidden,
        response('DIRECT_ACCESS'),
      );

      expect(retry).toEqual({
        descriptor: messages.join_to_view,
        onClick: expect.any(Function),
      });
    });

    it('return retry option for REQUEST_ACCESS', () => {
      const retry = getRetryOptions(
        url,
        SmartLinkStatus.Forbidden,
        response('REQUEST_ACCESS'),
      );

      expect(retry).toEqual({
        descriptor: messages.request_access_to_view,
        onClick: expect.any(Function),
      });
    });

    it('return retry option for PENDING_REQUEST_EXISTS', () => {
      const retry = getRetryOptions(
        url,
        SmartLinkStatus.Forbidden,
        response('PENDING_REQUEST_EXISTS'),
      );

      expect(retry).toEqual({ descriptor: messages.pending_request });
    });

    it('return retry option for FORBIDDEN', () => {
      const retry = getRetryOptions(
        url,
        SmartLinkStatus.Forbidden,
        response('FORBIDDEN'),
      );

      expect(retry).toEqual({ descriptor: messages.forbidden_access });
    });

    it('return retry option for DENIED_REQUEST_EXISTS', () => {
      const retry = getRetryOptions(
        url,
        SmartLinkStatus.Forbidden,
        response('DENIED_REQUEST_EXISTS'),
      );

      expect(retry).toEqual({ descriptor: messages.request_denied });
    });
  });

  it('returns retry option for Unauthorized status', () => {
    const retry = getRetryOptions(url, SmartLinkStatus.Unauthorized);

    expect(retry).toEqual({ descriptor: messages.connect_link_account });
  });

  it('returns retry option for NotFound status', () => {
    const retry = getRetryOptions(url, SmartLinkStatus.NotFound);

    expect(retry).toEqual({ descriptor: messages.cannot_find_link });
  });
});
