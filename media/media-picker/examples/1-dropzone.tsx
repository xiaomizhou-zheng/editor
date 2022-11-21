// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';
import { IntlProvider } from 'react-intl-next';
import {
  defaultMediaPickerCollectionName,
  createUploadMediaClientConfig,
  createStorybookMediaClientConfig,
  fakeMediaClient,
  FeatureFlagsWrapper,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/standard-button';
import Toggle from '@atlaskit/toggle';
import Spinner from '@atlaskit/spinner';
import { FileState } from '@atlaskit/media-client';
import {
  DropzoneContainer,
  PopupHeader,
  PopupContainer,
  DropzoneContentWrapper,
  DropzoneItemsInfo,
} from '../example-helpers/stylesWrapper';
import { UploadPreviews } from '../example-helpers/upload-previews';
import { UfoLoggerWrapper } from '../example-helpers/UfoWrapper';
import { Dropzone } from '../src';
import { DropzoneConfig, UploadsStartEventPayload } from '../src/types';
import { LOGGED_FEATURE_FLAGS } from '../src/util/analytics';

export interface DropzoneWrapperState {
  isConnectedToUsersCollection: boolean;
  isActive: boolean;
  isFetchingLastItems: boolean;
  lastItems: any[];
  dropzoneContainer?: HTMLElement;
  fileIds: string[];
}
const mediaClientConfig = createUploadMediaClientConfig();
const nonUserMediaClientConfig = createStorybookMediaClientConfig({
  authType: 'asap',
});

class DropzoneWrapper extends Component<{}, DropzoneWrapperState> {
  dropzoneContainer?: HTMLDivElement;

  state: DropzoneWrapperState = {
    isConnectedToUsersCollection: true,
    isActive: true,
    isFetchingLastItems: true,
    lastItems: [],
    fileIds: [],
  };

  onUploadsStart = (payload: UploadsStartEventPayload) => {
    const fileIds = payload.files.map(({ id }) => id);
    this.setState({ fileIds });
  };

  renderDragZone = () => {
    const {
      isConnectedToUsersCollection,
      isActive,
      dropzoneContainer,
    } = this.state;

    if (!isActive || !dropzoneContainer) {
      return null;
    }

    const dropzoneMediaClient = isConnectedToUsersCollection
      ? fakeMediaClient(mediaClientConfig)
      : fakeMediaClient(nonUserMediaClientConfig);

    dropzoneMediaClient.on('file-added', this.onFileUploaded);

    const config: DropzoneConfig = {
      container: this.state.dropzoneContainer,
      uploadParams: {
        collection: defaultMediaPickerCollectionName,
      },
    };

    return (
      <UploadPreviews>
        {({ onUploadsStart, onError, onPreviewUpdate }) => (
          <Dropzone
            mediaClientConfig={dropzoneMediaClient.config}
            config={config}
            onUploadsStart={(payload) => {
              this.onUploadsStart(payload);
              onUploadsStart(payload);
            }}
            onError={onError}
            onPreviewUpdate={onPreviewUpdate}
          />
        )}
      </UploadPreviews>
    );
  };

  onFileUploaded = (fileState: FileState) => {
    console.log('onFileUploaded', fileState);
  };

  saveDropzoneContainer = async (element: HTMLDivElement) => {
    this.setState({ dropzoneContainer: element });
  };

  onConnectionChange = () => {
    const isConnectedToUsersCollection = !this.state
      .isConnectedToUsersCollection;
    this.setState({ isConnectedToUsersCollection });
  };

  onActiveChange = () => {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
  };

  renderLastItems = () => {
    const { isFetchingLastItems, lastItems } = this.state;

    if (isFetchingLastItems) {
      return <Spinner size="large" />;
    }

    return lastItems.map((item, key) => {
      const { id, details } = item;

      // details are not always present in the response
      const name = details ? details.name : '<no-details>';
      const mediaType = details ? details.mediaType : '<no-details>';

      return (
        <div key={key}>
          {id} | {name} |{mediaType}
        </div>
      );
    });
  };

  render() {
    const { isConnectedToUsersCollection, isActive } = this.state;

    return (
      <UfoLoggerWrapper>
        <FeatureFlagsWrapper filterFlags={LOGGED_FEATURE_FLAGS}>
          <IntlProvider locale={'en'}>
            <PopupContainer>
              <PopupHeader>
                <Button appearance="danger">Cancel uploads</Button>
                Connected to users collection
                <Toggle
                  defaultChecked={isConnectedToUsersCollection}
                  onChange={this.onConnectionChange}
                />
                Active
                <Toggle
                  defaultChecked={isActive}
                  onChange={this.onActiveChange}
                />
              </PopupHeader>
              <DropzoneContentWrapper>
                <DropzoneContainer
                  isActive={isActive}
                  ref={this.saveDropzoneContainer}
                />
                <DropzoneItemsInfo>
                  {this.renderDragZone()}
                  <h1>User collection items</h1>
                  {this.renderLastItems()}
                </DropzoneItemsInfo>
              </DropzoneContentWrapper>
            </PopupContainer>
          </IntlProvider>
        </FeatureFlagsWrapper>
      </UfoLoggerWrapper>
    );
  }
}

export default () => <DropzoneWrapper />;
