import React from 'react';
import { mount } from 'enzyme';
import BodiedExtension from '../../../../react/nodes/bodiedExtension';

import { RendererContext } from '../../../../react/types';
import ReactSerializer from '../../../../react';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import Loadable from 'react-loadable';

describe('Renderer - React/Nodes/BodiedExtension', () => {
  const providerFactory = ProviderFactory.create({});
  const extensionHandlers: ExtensionHandlers = {
    'com.atlassian.fabric': (param: any) => {
      switch (param.extensionKey) {
        case 'react':
          return <p>This is a react element</p>;
        case 'adf':
          return [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is a ADF node',
                },
              ],
            },
          ];
        case 'originalContent':
          return param.content;
        case 'error':
          throw new Error('Tong is cursing you...');
        default:
          return null;
      }
    },
  };

  const rendererContext: RendererContext = {
    adDoc: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Check out this extension',
            },
          ],
        },
        {
          type: 'extension',
          attrs: {
            extensionType: 'com.atlassian.stride',
            extensionKey: 'default',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is the default content of the extension',
                },
              ],
            },
          ],
        },
      ],
    },
    schema: getSchemaBasedOnStage('stage0'),
  };

  const serializer = new ReactSerializer({});

  it('should be able to fall back to default content', () => {
    const extension = mount(
      <BodiedExtension
        providers={providerFactory}
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="default"
        localId="c145e554-f571-4208-a0f1-2170e1987722"
      >
        <p>This is the default content of the extension</p>
      </BodiedExtension>,
    );

    expect(extension.find('div').first().text()).toEqual(
      'This is the default content of the extension',
    );
    extension.unmount();
  });

  it('should be able to render React.Element from extensionHandler', () => {
    const extension = mount(
      <BodiedExtension
        providers={providerFactory}
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="react"
        localId="c145e554-f571-4208-a0f1-2170e1987722"
      />,
    );

    expect(extension.find('div').first().text()).toEqual(
      'This is a react element',
    );
    extension.unmount();
  });

  it('should render the default content if extensionHandler throws an exception', () => {
    const extension = mount(
      <BodiedExtension
        providers={providerFactory}
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="error"
        localId="c145e554-f571-4208-a0f1-2170e1987722"
      >
        <p>This is the default content of the extension</p>
      </BodiedExtension>,
    );

    expect(extension.find('div').first().text()).toEqual(
      'This is the default content of the extension',
    );
    extension.unmount();
  });

  it('extension handler should receive type = bodiedExtension', () => {
    const extensionHandler = jest.fn();
    const extensionHandlers: ExtensionHandlers = {
      'com.atlassian.fabric': extensionHandler,
    };

    const fragmentLocalId = 'fragment-local-id';
    const fragmentMark = rendererContext.schema!.marks.fragment.create({
      localId: fragmentLocalId,
    });

    const extension = mount(
      <BodiedExtension
        providers={providerFactory}
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="react"
        localId="c145e554-f571-4208-a0f1-2170e1987722"
        marks={[fragmentMark]}
      />,
    );

    expect(extensionHandler.mock.calls[0][0]).toEqual({
      type: 'bodiedExtension',
      extensionType: 'com.atlassian.fabric',
      extensionKey: 'react',
      parameters: undefined,
      content: undefined,
      localId: 'c145e554-f571-4208-a0f1-2170e1987722',
      fragmentLocalId,
    });

    extension.unmount();
  });

  describe('extension providers', () => {
    const ExtensionHandlerFromProvider = ({ node }: any) => (
      <div>Extension provider: {node.content}</div>
    );

    const confluenceMacrosExtensionProvider = createFakeExtensionProvider(
      'fake.confluence',
      'expand',
      ExtensionHandlerFromProvider,
    );

    const providers = ProviderFactory.create({
      extensionProvider: Promise.resolve(
        combineExtensionProviders([confluenceMacrosExtensionProvider]),
      ),
    });

    it('should be able to render extensions with the extension provider', async () => {
      const extension = mount(
        <BodiedExtension
          providers={providers}
          serializer={serializer}
          extensionHandlers={extensionHandlers}
          rendererContext={rendererContext}
          extensionType="fake.confluence"
          extensionKey="expand"
          content="body"
          localId="c145e554-f571-4208-a0f1-2170e1987722"
        />,
      );

      await Loadable.preloadAll();

      extension.update();

      expect(extension.text()).toEqual('Extension provider: body');

      extension.unmount();
    });

    it('should prioritize extension handlers (sync) over extension provider', async () => {
      const extensionHandlers: ExtensionHandlers = {
        'fake.confluence': (node: any) => (
          <div>Extension handler: {node.content}</div>
        ),
      };

      const extension = mount(
        <BodiedExtension
          providers={providers}
          serializer={serializer}
          extensionHandlers={extensionHandlers}
          rendererContext={rendererContext}
          extensionType="fake.confluence"
          extensionKey="expand"
          content="body"
          localId="c145e554-f571-4208-a0f1-2170e1987722"
        />,
      );

      expect(extension.text()).toEqual('Extension handler: body');

      extension.unmount();
    });

    it('should fallback to extension provider if not handled by the extension handler', async () => {
      const extensionHandlers: ExtensionHandlers = {
        'fake.confluence': (node: any) => null,
      };

      const extension = mount(
        <BodiedExtension
          providers={providers}
          serializer={serializer}
          extensionHandlers={extensionHandlers}
          rendererContext={rendererContext}
          extensionType="fake.confluence"
          extensionKey="expand"
          content="body"
          localId="c145e554-f571-4208-a0f1-2170e1987722"
        />,
      );

      await Loadable.preloadAll();

      extension.update();

      expect(extension.text()).toEqual('Extension provider: body');

      extension.unmount();
    });
  });
});
