import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';

import { Comment, Content, MetaData, User } from '../types';

export interface ShareClient {
  share(
    content: Content,
    recipients: User[],
    metadata: MetaData,
    comment?: Comment,
  ): Promise<ShareResponse>;

  getConfig(cloudId: string): Promise<ConfigResponse>;
}

export type ShareRequest = (
  content: Content,
  recipients: User[],
  metadata: MetaData,
  comment?: Comment,
) => Promise<ShareResponse>;

export type ShareResponse = {
  shareRequestId: string;
};

export type ConfigResponse = {
  disableSharingToEmails?: boolean;
};

export const DEFAULT_SHARE_PATH = 'share';
export const SHARE_CONFIG_PATH = 'share/configuration';
export const DEFAULT_SHARE_SERVICE_URL = '/gateway/api';

export class ShareServiceClient implements ShareClient {
  private serviceConfig: ServiceConfig;

  constructor(serviceConfig?: Partial<ServiceConfig>) {
    this.serviceConfig = {
      url: DEFAULT_SHARE_SERVICE_URL,
      ...(serviceConfig || {}),
    };
  }

  public getConfig(cloudId: string): Promise<ConfigResponse> {
    const options = {
      path: SHARE_CONFIG_PATH,
      queryParams: { cloudId },
      requestInit: { method: 'get' },
    };

    return utils.requestService(this.serviceConfig, options);
  }

  /**
   * To send a POST request to the share endpoint in Share service
   */
  public share(
    content: Content,
    recipients: User[],
    metadata: MetaData,
    comment?: Comment,
  ): Promise<ShareResponse> {
    const options: RequestServiceOptions = {
      path: DEFAULT_SHARE_PATH,
      requestInit: {
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          content,
          recipients,
          metadata,
          comment,
        }),
      },
    };

    return utils.requestService(this.serviceConfig, options);
  }
}
