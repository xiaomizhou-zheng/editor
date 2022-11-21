import { ServiceConfig, utils } from '@atlaskit/util-service-support';

import {
  DEFAULT_SHARE_PATH,
  DEFAULT_SHARE_SERVICE_URL,
  SHARE_CONFIG_PATH,
  ShareClient,
  ShareServiceClient,
} from '../../../clients/ShareServiceClient';
import { Comment, Content, MetaData, User } from '../../../types';

describe('ShareServiceClientImpl', () => {
  let requestSpy: jest.SpyInstance;
  let shareServiceClient: ShareClient;
  let mockContent: Content = {
    link: 'link',
    ari: 'ari',
    title: 'title',
    type: 'type',
  };
  let mockRecipients: User[] = [
    { type: 'user', id: 'id' },
    { type: 'user', email: 'email' },
  ];
  let mockMetaData: MetaData = {
    productId: 'confluence',
    atlOriginId: 'atlOriginId',
  };
  let mockComment: Comment = {
    format: 'plain_text',
    value: 'mock comment',
  };

  beforeEach(() => {
    requestSpy = jest.spyOn(utils, 'requestService').mockResolvedValue({});
    shareServiceClient = new ShareServiceClient();
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  describe('share', () => {
    it('should call requestService with default serviceConfig and options object', async () => {
      await shareServiceClient.share(
        mockContent,
        mockRecipients,
        mockMetaData,
        mockComment,
      );
      expect(requestSpy).toBeCalledTimes(1);
      const callArgs = requestSpy.mock.calls[0];
      expect(callArgs[0]).toMatchObject({
        url: DEFAULT_SHARE_SERVICE_URL,
      });
      expect(callArgs[1]).toMatchObject({
        path: DEFAULT_SHARE_PATH,
        requestInit: {
          method: 'post',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            content: mockContent,
            recipients: mockRecipients,
            metadata: mockMetaData,
            comment: mockComment,
          }),
        },
      });
    });

    it('should call requestService with configurable serviceConfig', async () => {
      const mockServiceConfig: ServiceConfig = {
        url: 'customurl',
      };
      shareServiceClient = new ShareServiceClient(mockServiceConfig);
      await shareServiceClient.share(
        mockContent,
        mockRecipients,
        mockMetaData,
        mockComment,
      );
      expect(requestSpy).toBeCalledTimes(1);
      const callArgs = requestSpy.mock.calls[0];
      expect(callArgs[0]).toMatchObject(mockServiceConfig);
    });
  });

  describe('getConfig', () => {
    it('should call requestService', async () => {
      await shareServiceClient.getConfig('some-cloud-id');
      expect(requestSpy).toBeCalledTimes(1);
      const callArgs = requestSpy.mock.calls[0];
      expect(callArgs[0]).toMatchObject({
        url: DEFAULT_SHARE_SERVICE_URL,
      });
      expect(callArgs[1]).toMatchObject({
        path: SHARE_CONFIG_PATH,
        queryParams: { cloudId: 'some-cloud-id' },
        requestInit: {
          method: 'get',
        },
      });
    });
  });
});
