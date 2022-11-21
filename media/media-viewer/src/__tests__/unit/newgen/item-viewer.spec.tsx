jest.mock('../../../analytics', () => {
  const actualModule = jest.requireActual('../../../analytics');
  return {
    ...actualModule,
    fireAnalytics: jest.fn(),
  };
});
import { fireAnalytics } from '../../../analytics';
import * as mocks from './item-viewer.mock';
import * as ufoWrapper from '../../../analytics/ufoExperiences';
import React from 'react';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button/custom-theme-button';

import {
  ProcessedFileState,
  FileIdentifier,
  FileState,
  Identifier,
  MediaClient,
  MediaType,
  MediaSubscribable,
  createMediaSubscribable,
} from '@atlaskit/media-client';
import {
  mountWithIntlContext,
  fakeMediaClient,
  asMock,
  nextTick,
  mountWithIntlWrapper,
} from '@atlaskit/media-test-helpers';
import { ItemViewer, ItemViewerBase } from '../../../item-viewer';
import { ErrorMessage } from '../../../errorMessage';
import { MediaViewerError, MediaViewerErrorReason } from '../../../errors';
import { ImageViewer } from '../../../viewers/image';
import { ErrorViewDownloadButton } from '../../../download';
import { VideoViewer, Props as VideoViewerProps } from '../../../viewers/video';
import { AudioViewer, Props as AudioViewerProps } from '../../../viewers/audio';
import { DocViewer } from '../../../viewers/doc';
import { InteractiveImg } from '../../../viewers/image/interactive-img';
import ArchiveViewerLoader from '../../../viewers/archiveSidebar/archiveViewerLoader';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { CodeViewer } from '../../../viewers/codeViewer';
import Loadable from 'react-loadable';

const identifier: Identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  mediaItemType: 'file',
  collectionName: 'some-collection',
};
const externalImageIdentifier: Identifier = {
  mediaItemType: 'external-image',
  dataURI: 'some-src',
  name: 'some-name',
};

const makeFakeMediaClient = (observable: MediaSubscribable<any>) => {
  const mediaClient = fakeMediaClient();

  asMock(mediaClient.file.getFileState).mockReturnValue(observable);
  return mediaClient;
};
const mockstartMediaFileUfoExperience = jest.spyOn(
  ufoWrapper,
  'startMediaFileUfoExperience',
);
const mocksucceedMediaFileUfoExperience = jest.spyOn(
  ufoWrapper,
  'succeedMediaFileUfoExperience',
);
const mockfailMediaFileUfoExperience = jest.spyOn(
  ufoWrapper,
  'failMediaFileUfoExperience',
);

function mountComponent(
  mediaClient: MediaClient,
  identifier: Identifier,
  featureFlags?: MediaFeatureFlags,
) {
  const el = mountWithIntlContext(
    <ItemViewer
      previewCount={0}
      mediaClient={mediaClient}
      identifier={identifier}
      featureFlags={featureFlags}
    />,
  );
  const instance = el.find(ItemViewerBase).instance() as any;
  return { el, instance };
}

function mountComponentWithIntlWrapper(
  mediaClient: MediaClient,
  identifier: Identifier,
  featureFlags?: MediaFeatureFlags,
) {
  const el = mountWithIntlWrapper(
    <ItemViewer
      previewCount={0}
      mediaClient={mediaClient}
      identifier={identifier}
      featureFlags={featureFlags}
    />,
  );
  const instance = el.find(ItemViewerBase).instance() as any;
  return { el, instance };
}

function mountBaseComponent(
  mediaClient: MediaClient,
  identifier: FileIdentifier,
  props?: Partial<AudioViewerProps | VideoViewerProps>,
) {
  const createAnalyticsEventSpy = jest.fn();
  createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });
  const el = mountWithIntlWrapper(
    <ItemViewerBase
      createAnalyticsEvent={createAnalyticsEventSpy}
      previewCount={0}
      mediaClient={mediaClient}
      identifier={identifier}
      {...props}
    />,
  );

  return { el, createAnalyticsEventSpy };
}

describe('<ItemViewer />', () => {
  Loadable.preloadAll();
  beforeEach(() => {
    mocks.clearViewerError();
  });

  it('shows an indicator while loading', () => {
    const mediaClient = makeFakeMediaClient(createMediaSubscribable());
    const { el } = mountComponent(mediaClient, identifier);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a generic error on unkown error', () => {
    const subscribable = createMediaSubscribable(
      new Error('something bad happened!'),
    );
    const mediaClient = makeFakeMediaClient(subscribable);
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain('Something went wrong');
    expect(errorMessage.find(Button)).toHaveLength(0);
  });

  it('should show the image viewer if media type is image', () => {
    const defaultFileState: FileState = {
      status: 'processed',
      id: identifier.id,
      name: 'file-name',
      size: 10,
      artifacts: {},
      mediaType: 'image',
      mimeType: 'image/png',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(
      createMediaSubscribable(defaultFileState),
    );
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(el.find(ImageViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(ImageViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should should error and download button if processing Status failed', () => {
    const subject = createMediaSubscribable({
      status: 'failed-processing',
      id: 'some-id',
      name: 'some-name',
      size: 123,
      artifacts: {},
      mediaType: 'unknown',
      mimeType: 'some-mime-type',
    });
    const mediaClient = makeFakeMediaClient(subject);
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.prop('error').message).toEqual(
      'itemviewer-file-failed-processing-status',
    );
    expect(errorMessage.find(ErrorViewDownloadButton).length).toEqual(1);
  });

  it('should should error and download button if file is in error state', () => {
    const defaultFileState: FileState = {
      id: '123',
      status: 'error',
    };
    const mediaClient = makeFakeMediaClient(
      createMediaSubscribable(defaultFileState),
    );
    const el = mountWithIntlContext(
      <ItemViewer
        previewCount={0}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.prop('error').message).toEqual(
      'itemviewer-file-error-status',
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('should show the video viewer if media type is video', () => {
    const state: ProcessedFileState = {
      id: identifier.id,
      mediaType: 'video',
      status: 'processed',
      mimeType: '',
      name: '',
      size: 1,
      artifacts: {},
      representations: {},
    };
    const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(el.find(VideoViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(VideoViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the audio viewer if media type is audio', () => {
    const state: ProcessedFileState = {
      id: identifier.id,
      mediaType: 'audio',
      status: 'processed',
      mimeType: '',
      name: '',
      size: 1,
      artifacts: {},
      representations: {},
    };
    const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(el.find(AudioViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(AudioViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the document viewer if media type is document', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'doc',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(el.find(DocViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(DocViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should load archiveViewerLoader if media type is archive', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'archive',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
    };
    const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(el.find(ArchiveViewerLoader)).toHaveLength(1);
  });

  it('should should error and download button if file is unsupported', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'unknown',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.prop('error').message).toEqual('unsupported');
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('MSW-720: passes the collectionName to getFileState', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'image',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(mediaClient.file.getFileState).toHaveBeenCalledWith('some-id', {
      collectionName: 'some-collection',
    });
  });

  it('should render InteractiveImg for external image identifier', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'image',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
    const { el } = mountComponent(mediaClient, externalImageIdentifier);
    el.update();

    expect(el.find(InteractiveImg)).toHaveLength(1);
    expect(el.find(InteractiveImg).prop('src')).toEqual('some-src');
  });

  describe('Subscription', () => {
    it('unsubscribes from the provider when unmounted', () => {
      const state: FileState = {
        id: '123',
        mediaType: 'unknown',
        status: 'processed',
        artifacts: {},
        name: '',
        size: 10,
        mimeType: '',
        representations: { image: {} },
      };
      const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
      const release = jest.fn();
      const { el, instance } = mountComponent(mediaClient, identifier);
      instance.release = release;
      expect(instance.release).toHaveBeenCalledTimes(0);
      el.unmount();
      expect(instance.release).toHaveBeenCalledTimes(1);
    });

    it('resubscribes to the provider when the data property value is changed', () => {
      const mediaClient = makeFakeMediaClient(
        createMediaSubscribable({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const identifierCopy = { ...identifier };
      const { el } = mountComponentWithIntlWrapper(mediaClient, identifier);
      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);

      // if the values stay the same, we will not resubscribe
      el.setProps({ mediaClient, identifier: identifierCopy });
      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);

      // ... but if the identifier change we will resubscribe
      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };
      el.setProps({ mediaClient, identifier: identifier2 });
      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(2);

      // if the mediaClient changes, we will also resubscribe
      const newMediaClient = makeFakeMediaClient(
        createMediaSubscribable({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );

      el.setProps({ mediaClient: newMediaClient, identifier: identifier2 });
      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(2);
      expect(newMediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    });

    it('should return to PENDING state when resets', () => {
      const mediaClient = makeFakeMediaClient(
        createMediaSubscribable({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const { el } = mountBaseComponent(mediaClient, identifier);
      expect(el.find(ItemViewerBase).state().item.status).toEqual('SUCCESSFUL');

      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };

      // since the test is executed synchronously
      // let's prevent the second call to getFile from immediately resolving and
      // updating the state to SUCCESSFUL before we run the assertion.
      mediaClient.file.getFileState = () => createMediaSubscribable();
      el.setProps({ mediaClient, identifier: identifier2 });
      el.update();

      expect(el.find(ItemViewerBase).state().item.status).toEqual('PENDING');
    });
  });

  describe('Analytics', () => {
    beforeEach(() => {
      asMock(fireAnalytics).mockReset();
      jest.clearAllMocks();
    });

    it('should trigger commence event when the viewer mounts', () => {
      const mediaClient = makeFakeMediaClient(
        createMediaSubscribable({
          status: 'processed',
          id: identifier.id,
          name: 'file-name',
          size: 10,
          artifacts: {},
          mediaType: 'image',
          mimeType: 'image/png',
          representations: { image: {} },
        }),
      );
      const { el } = mountComponent(mediaClient, identifier);
      el.update();

      expect(asMock(fireAnalytics).mock.calls[0][0]).toEqual({
        action: 'commenced',
        actionSubject: 'mediaFile',
        attributes: {
          fileAttributes: {
            fileId: 'some-id',
          },
        },
        eventType: 'operational',
      });

      expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
    });

    it('should trigger success event when the file is in uploading state and the viewer loads sucessfully', () => {
      const mediaClient = makeFakeMediaClient(
        createMediaSubscribable({
          status: 'uploading',
          id: identifier.id,
          name: 'file-name',
          size: 10,
          progress: 1,
          mediaType: 'image',
          mimeType: 'image/png',
        }),
      );
      const { el } = mountComponent(mediaClient, identifier);
      el.update();

      expect(asMock(fireAnalytics).mock.calls[1][0]).toEqual({
        action: 'loadSucceeded',
        actionSubject: 'mediaFile',
        attributes: {
          fileAttributes: {
            fileId: 'some-id',
            fileMediatype: 'image',
            fileMimetype: 'image/png',
            fileSize: 10,
          },
          fileMediatype: 'image',
          status: 'success',
        },
        eventType: 'operational',
      });
      expect(mocksucceedMediaFileUfoExperience).toBeCalledWith({
        fileAttributes: {
          fileId: 'some-id',
          fileMediatype: 'image',
          fileMimetype: 'image/png',
          fileSize: 10,
        },
        fileStateFlags: {
          wasStatusUploading: true,
          wasStatusProcessing: false,
        },
      });
    });

    it('should trigger success event when the file is in processing state and the viewer loads sucessfully', () => {
      const mediaClient = makeFakeMediaClient(
        createMediaSubscribable({
          status: 'processing',
          id: identifier.id,
          name: 'file-name',
          size: 10,
          mediaType: 'image',
          mimeType: 'image/png',
        }),
      );
      const { el } = mountComponent(mediaClient, identifier);
      el.update();

      expect(asMock(fireAnalytics).mock.calls[1][0]).toEqual({
        action: 'loadSucceeded',
        actionSubject: 'mediaFile',
        attributes: {
          fileAttributes: {
            fileId: 'some-id',
            fileMediatype: 'image',
            fileMimetype: 'image/png',
            fileSize: 10,
          },
          fileMediatype: 'image',
          status: 'success',
        },
        eventType: 'operational',
      });
      expect(mocksucceedMediaFileUfoExperience).toBeCalledWith({
        fileAttributes: {
          fileId: 'some-id',
          fileMediatype: 'image',
          fileMimetype: 'image/png',
          fileSize: 10,
        },
        fileStateFlags: {
          wasStatusUploading: false,
          wasStatusProcessing: true,
        },
      });
    });

    it('should fire load success when external image loads', () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'image',
        status: 'processed',
        artifacts: {},
        name: '',
        size: 10,
        mimeType: '',
        representations: { image: {} },
      };
      const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
      const { el } = mountComponent(mediaClient, externalImageIdentifier);
      el.update();

      el.find(InteractiveImg).prop('onLoad')();

      expect(asMock(fireAnalytics).mock.calls[0][0]).toEqual({
        action: 'loadSucceeded',
        actionSubject: 'mediaFile',
        attributes: {
          status: 'success',
          fileAttributes: {
            fileId: 'external-image',
            fileMediatype: undefined,
            fileMimetype: undefined,
            fileSize: undefined,
          },
        },
        eventType: 'operational',
      });
      expect(mocksucceedMediaFileUfoExperience).toBeCalledWith({
        fileAttributes: {
          fileId: 'external-image',
          fileMediatype: undefined,
          fileMimetype: undefined,
          fileSize: undefined,
        },
        fileStateFlags: {
          wasStatusUploading: false,
          wasStatusProcessing: false,
        },
      });
    });

    it('should fire load fail when external image errors', () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'image',
        status: 'processed',
        artifacts: {},
        name: '',
        size: 10,
        mimeType: '',
        representations: { image: {} },
      };
      const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
      const { el } = mountComponent(mediaClient, externalImageIdentifier);
      const fileAttributes = {
        fileId: 'undefined',
        fileMediatype: undefined,
        fileMimetype: undefined,
        fileSize: undefined,
      };

      const errorInfo = {
        failReason: 'imageviewer-external-onerror',
        errorDetail: undefined,
      };
      el.update();

      el.find(InteractiveImg).prop('onError')();

      expect(asMock(fireAnalytics).mock.calls[0][0]).toEqual({
        action: 'loadFailed',
        actionSubject: 'mediaFile',
        attributes: {
          ...errorInfo,
          status: 'fail',
          fileAttributes: fileAttributes,
        },
        eventType: 'operational',
      });
      expect(mockfailMediaFileUfoExperience).toBeCalledWith({
        ...errorInfo,
        fileAttributes: fileAttributes,
        fileStateFlags: {
          wasStatusProcessing: false,
          wasStatusUploading: false,
        },
      });
    });

    it('should trigger success event when the viewer loads successfully', () => {
      const mediaClient = makeFakeMediaClient(
        createMediaSubscribable({
          status: 'processed',
          id: identifier.id,
          name: 'file-name',
          size: 10,
          artifacts: {},
          mediaType: 'image',
          mimeType: 'image/png',
          representations: { image: {} },
        }),
      );
      const { el } = mountComponent(mediaClient, identifier);
      el.update();

      expect(asMock(fireAnalytics).mock.calls[1][0]).toEqual({
        action: 'loadSucceeded',
        actionSubject: 'mediaFile',
        attributes: {
          fileAttributes: {
            fileId: 'some-id',
            fileMediatype: 'image',
            fileMimetype: 'image/png',
            fileSize: 10,
          },
          fileMediatype: 'image',
          status: 'success',
        },
        eventType: 'operational',
      });
      expect(mocksucceedMediaFileUfoExperience).toBeCalledWith({
        fileAttributes: {
          fileId: 'some-id',
          fileMediatype: 'image',
          fileMimetype: 'image/png',
          fileSize: 10,
        },
        fileStateFlags: {
          wasStatusUploading: false,
          wasStatusProcessing: false,
        },
      });
    });

    it('should show error when metadata fetching ended with an error', () => {
      const errorReason: MediaViewerErrorReason = 'itemviewer-fetch-metadata';
      const subscribable = createMediaSubscribable(
        new MediaViewerError(errorReason),
      );
      const mediaClient = makeFakeMediaClient(subscribable);
      const { el } = mountBaseComponent(mediaClient, identifier);
      const errorMessage = el.find(ErrorMessage);
      expect(errorMessage).toHaveLength(1);
      expect(errorMessage.prop('error').message).toEqual(errorReason);
    });

    it('should show error when viewer returned an error', () => {
      const errorReason: MediaViewerErrorReason = 'imageviewer-fetch-url';
      mocks.setViewerError(new MediaViewerError(errorReason));
      const mediaClient = makeFakeMediaClient(
        createMediaSubscribable({
          id: identifier.id,
          mediaType: 'image',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const { el } = mountBaseComponent(mediaClient, identifier);
      const errorMessage = el.find(ErrorMessage);
      expect(errorMessage).toHaveLength(1);
      expect(errorMessage.prop('error').message).toEqual(errorReason);
    });

    it('should show error when file failed processing', () => {
      const mediaClient = makeFakeMediaClient(
        createMediaSubscribable({
          id: identifier.id,
          mediaType: 'image',
          status: 'failed-processing',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const fileAttributes = {
        fileId: identifier.id,
        fileMediatype: 'image',
        fileMimetype: '',
        fileSize: 10,
      };
      const { el } = mountBaseComponent(mediaClient, identifier);
      const errorMessage = el.find('ErrorMessage');
      expect(errorMessage).toHaveLength(1);
      const error = errorMessage.prop('error') as Error;
      expect(error.message).toEqual('itemviewer-file-failed-processing-status');
      expect(mockfailMediaFileUfoExperience).toBeCalledWith({
        error: undefined,
        errorDetail: undefined,
        failReason: error.message,
        request: undefined,
        fileAttributes: fileAttributes,
        fileStateFlags: {
          wasStatusUploading: false,
          wasStatusProcessing: false,
        },
      });
    });

    it('should show error if DocumentViewer fails', async () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'doc',
        status: 'processed',
        artifacts: {},
        name: '',
        size: 0,
        mimeType: '',
        representations: { image: {} },
      };
      const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
      const { el } = mountBaseComponent(mediaClient, identifier);
      el.update();
      const docViewer = el.find(DocViewer);
      const mvError = new MediaViewerError('docviewer-fetch-url');
      expect(docViewer).toHaveLength(1);
      await nextTick();
      docViewer.prop('onError')(mvError);
      el.update();
      const errorMessage = el.find(ErrorMessage);
      expect(errorMessage).toHaveLength(1);
      const error = errorMessage.prop('error') as Error;
      expect(error.message).toEqual(mvError.message);
    });

    test.each<[MediaType, MediaType]>([['audio', 'video']])(
      'should show error when %s viewer errors',
      (type) => {
        const state: ProcessedFileState = {
          id: identifier.id,
          mediaType: type,
          status: 'processed',
          mimeType: '',
          name: '',
          size: 1,
          artifacts: {},
          representations: {},
        };
        const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
        const onErrorSpy = jest.fn();
        const { el } = mountBaseComponent(mediaClient, identifier, {
          onError: onErrorSpy,
        });
        const Viewer = el.find(type === 'audio' ? AudioViewer : VideoViewer);
        const onError = Viewer.prop('onError');
        onError(
          new MediaViewerError(
            type === 'audio' ? 'audioviewer-playback' : 'videoviewer-playback',
          ),
        );
        el.update();
        const errorMessage = el.find(ErrorMessage);
        expect(errorMessage).toHaveLength(1);
      },
    );
  });

  describe('CodeViewer', () => {
    // should only show codeviewer if (1) FF for codeviewer is on (2) It's a code-viewable item
    it('should load codeViewer if the file is code type', () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'unknown',
        status: 'processed',
        artifacts: {},
        name: 'file.c',
        size: 10,
        mimeType: '',
      };
      const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
      const { el } = mountComponent(mediaClient, identifier);
      el.update();
      expect(el.find(CodeViewer)).toHaveLength(1);
    });

    it('should not load codeViewer if the file is not a code type', () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'unknown',
        status: 'processed',
        artifacts: {},
        name: 'file.pdf',
        size: 10,
        mimeType: '',
      };
      const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
      const { el } = mountComponent(mediaClient, identifier);
      el.update();
      expect(el.find(CodeViewer)).toHaveLength(0);
    });

    it('should show error if file size exceeds the limit', () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'unknown',
        status: 'processed',
        artifacts: {},
        name: 'file.c',
        size: 20000000,
        mimeType: '',
      };
      const mediaClient = makeFakeMediaClient(createMediaSubscribable(state));
      const { el } = mountComponent(mediaClient, identifier);
      el.update();

      const errorMessage = el.find(ErrorMessage);
      expect(errorMessage).toHaveLength(1);
      expect(errorMessage.prop('error').message).toEqual(
        'codeviewer-file-size-exceeds',
      );
      expect(errorMessage.find(ErrorViewDownloadButton).length).toEqual(1);
    });
  });
});
