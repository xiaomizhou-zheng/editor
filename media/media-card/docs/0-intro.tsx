import React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';
import { createRxjsNotice } from '@atlaskit/media-common/docs';

export default md`
${(<AtlassianInternalWarning />)}

${createRxjsNotice('Media Card')}
  
  ### Note:

  Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to target older browsers.
  We recommend the use of [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/) & [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

  ## Usage

  ${code`
  import { Card } from '@atlaskit/media-card';
  import { MediaClientConfig } from '@atlaskit/media-core';

  const mediaClientConfig = {
    authProvider,
  };

  // external url preview
  const urlPreviewId = {
    mediaItemType: 'external-image',
    dataURI: 'http://external-image-url',
  };

  <Card mediaClientConfig={mediaClientConfig} identifier={urlPreviewId} />;

  // stored file
  const fileId = {
    mediaItemType: 'file',
    id: 'some-file-id',
    collectionName: 'some-collection-name',
  };

  <Card mediaClientConfig={mediaClientConfig} identifier={fileId} />;
`}

${(
  <Example
    Component={require('../examples/0-file-card-flow').default}
    title="File Card"
    source={require('!!raw-loader!../examples/0-file-card-flow')}
  />
)}

${(
  <Props
    heading="Properties"
    props={require('!!extract-react-types-loader!../src/card')}
  />
)}

`;
