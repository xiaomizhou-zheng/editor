import React from 'react';
import { mount } from 'enzyme';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import {
  FileState,
  RequestError,
  TouchFileDescriptor,
} from '@atlaskit/media-client';
import {
  ANALYTICS_MEDIA_CHANNEL,
  MediaFeatureFlags,
} from '@atlaskit/media-common';

import { Browser } from '../../browser/browser';
import { BrowserConfig } from '../../../../src/types';
import { LocalUploadConfig } from '../../../../src/components/types';
import * as ufoWrapper from '../../../util/ufoExperiences';

describe('Browser analytics instrumentation', () => {
  const browseConfig: BrowserConfig & LocalUploadConfig = {
    uploadParams: {},
  };
  const someFeatureFlags: MediaFeatureFlags = {
    folderUploads: true,
    newCardExperience: false,
    mediaUploadApiV2: false,
  };
  const uploadId = 'upload id';
  let oldDateNow: () => number;

  const mockstartMediaUploadUfoExperience = jest.spyOn(
    ufoWrapper,
    'startMediaUploadUfoExperience',
  );

  const mocksucceedMediaUploadUfoExperience = jest.spyOn(
    ufoWrapper,
    'succeedMediaUploadUfoExperience',
  );

  const mockfailMediaUploadUfoExperience = jest.spyOn(
    ufoWrapper,
    'failMediaUploadUfoExperience',
  );

  beforeEach(() => {
    oldDateNow = Date.now;
    Date.now = () => 111;
    jest.clearAllMocks();
  });

  afterEach(() => {
    Date.now = oldDateNow;
  });

  it('should fire a commenced event on uploadsStart', () => {
    const mediaClient = fakeMediaClient();
    mediaClient.file.upload = jest.fn().mockReturnValue(new ReplaySubject(1));
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) =>
        Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
        }),
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser
          mediaClient={mediaClient}
          config={browseConfig}
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: someFeatureFlags,
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'commenced',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
    expect(mockstartMediaUploadUfoExperience).toBeCalledTimes(1);
    expect(mockstartMediaUploadUfoExperience).toBeCalledWith(
      expect.any(String),
      'browser',
    );
  });

  it('should fire an uploaded success event on end', () => {
    const mediaClient = fakeMediaClient();
    const fileStateObservable = new ReplaySubject<FileState>(1);
    fileStateObservable.next({
      id: 'file id',
      mediaType: 'doc',
      name: '',
      mimeType: 'text/plain',
      size: 13,
      status: 'processing',
    });
    mediaClient.file.upload = jest.fn().mockReturnValue(fileStateObservable);
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) =>
        Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
        }),
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser
          mediaClient={mediaClient}
          config={browseConfig}
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    expect(onEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: someFeatureFlags,
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'succeeded',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            status: 'success',
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
            uploadDurationMsec: -1,
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
    expect(mocksucceedMediaUploadUfoExperience).toBeCalledWith(
      expect.any(String),
      {
        fileId: expect.any(String),
        fileSize: 13,
        fileMimetype: 'text/plain',
      },
    );
  });

  it('should fire an uploaded fail event on end', () => {
    const mediaClient = fakeMediaClient();
    const fileStateObservable = new ReplaySubject<FileState>(1);
    fileStateObservable.error(
      new RequestError('serverBadGateway', {
        method: 'GET',
        endpoint: '/some-endpoint',
        mediaRegion: 'some-region',
        mediaEnv: 'some-env',
      }),
    );
    mediaClient.file.upload = jest.fn().mockReturnValue(fileStateObservable);
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) =>
        Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
        }),
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser
          mediaClient={mediaClient}
          config={browseConfig}
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    expect(onEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: someFeatureFlags,
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'failed',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            status: 'fail',
            failReason: 'upload_fail',
            error: 'serverBadGateway',
            request: {
              method: 'GET',
              endpoint: '/some-endpoint',
              mediaRegion: 'some-region',
              mediaEnv: 'some-env',
            },
            sourceType: 'local',
            serviceName: 'upload',
            fileAttributes: {
              fileId: expect.any(String),
            },
            uploadDurationMsec: -1,
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
    expect(mockfailMediaUploadUfoExperience).toBeCalledWith(
      expect.any(String),
      {
        failReason: 'upload_fail',
        error: 'serverBadGateway',
        request: {
          method: 'GET',
          endpoint: '/some-endpoint',
          mediaRegion: 'some-region',
          mediaEnv: 'some-env',
        },
        fileAttributes: {
          fileId: expect.any(String),
        },
        uploadDurationMsec: -1,
      },
    );
  });

  it('should populate upload duration time', async () => {
    const mediaClient = fakeMediaClient();

    const fileStateObservable = new ReplaySubject<FileState>(1);
    mediaClient.file.upload = jest.fn().mockReturnValue(fileStateObservable);
    mediaClient.file.touchFiles = jest.fn(
      async (descriptors: TouchFileDescriptor[], collection?: string) => {
        await nextTick(); // wait here so upload-start emitted before we go into upload
        fileStateObservable.next({
          id: descriptors[0].fileId,
          mediaType: 'doc',
          name: '',
          mimeType: 'text/plain',
          size: 13,
          status: 'processing',
        });
        return Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
        });
      },
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser
          mediaClient={mediaClient}
          config={browseConfig}
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    await nextTick(); // waiting here for whole upload logic to finish and fire upload-end

    expect(onEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: someFeatureFlags,
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'commenced',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );

    expect(onEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: someFeatureFlags,
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'succeeded',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            status: 'success',
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
            uploadDurationMsec: 0,
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
    expect(mockstartMediaUploadUfoExperience).toBeCalledTimes(1);
    expect(mocksucceedMediaUploadUfoExperience).toBeCalledWith(
      expect.any(String),
      {
        fileId: expect.any(String),
        fileSize: 13,
        fileMimetype: 'text/plain',
      },
    );
  });
});
