import React from 'react';
import {
  createStorybookMediaClientConfig,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { imageItem } from '../example-helpers';
import { MainWrapper } from '../example-helpers/MainWrapper';
import { MediaViewer } from '../src';

const mediaClientConfig = createStorybookMediaClientConfig();
const selectedItem = imageItem;

export default class Example extends React.Component<{}, {}> {
  render() {
    return (
      <MainWrapper>
        <MediaViewer
          mediaClientConfig={mediaClientConfig}
          selectedItem={selectedItem}
          dataSource={{
            list: [selectedItem],
            collectionName: defaultCollectionName,
          }}
          collectionName={defaultCollectionName}
          onClose={() => this.setState({ selectedItem: undefined })}
        />
      </MainWrapper>
    );
  }
}
