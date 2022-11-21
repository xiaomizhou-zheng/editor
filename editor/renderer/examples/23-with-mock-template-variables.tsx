import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import document from './helper/template-variables.adf.json';

const extensionHandlers: ExtensionHandlers = {
  'com.atlassian.confluence.template': (ext) => {
    const { extensionKey, parameters } = ext;

    switch (extensionKey) {
      case 'variable':
        return <input placeholder={parameters.name} />;
      default:
        return null;
    }
  },
};

export default function Example() {
  return (
    <RendererDemo
      document={document}
      withProviders={true}
      withPortal={true}
      allowColumnSorting={true}
      withExtension={true}
      extensionHandlers={extensionHandlers}
      serializer="react"
    />
  );
}
