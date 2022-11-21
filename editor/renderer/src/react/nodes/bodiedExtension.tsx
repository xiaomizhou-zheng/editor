import React from 'react';
import { Mark as PMMark, Node as PMNode } from 'prosemirror-model';
import { RendererContext } from '../types';
import { Serializer } from '../..';
import { ExtensionLayout } from '@atlaskit/adf-schema';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { renderExtension } from './extension';
import ExtensionRenderer from '../../ui/ExtensionRenderer';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  providers: ProviderFactory;
  extensionType: string;
  extensionKey: string;
  path?: PMNode[];
  originalContent?: any;
  parameters?: any;
  content?: any;
  layout?: ExtensionLayout;
  localId?: string;
  marks?: PMMark[];
}

const BodiedExtension: React.FunctionComponent<Props> = (props) => {
  const { children, layout = 'default', path = [] } = props;

  const removeOverflow = React.Children.toArray<any>(children)
    .map((child) => child!.props.nodeType === 'table')
    .every(Boolean);

  return (
    <ExtensionRenderer {...props} type="bodiedExtension">
      {({ result }) => {
        try {
          if (result && React.isValidElement(result)) {
            // Return the content directly if it's a valid JSX.Element
            return renderExtension(
              result,
              layout,
              {
                isTopLevel: path.length < 1,
              },
              removeOverflow,
            );
          }
        } catch (e) {
          /** We don't want this error to block renderer */
          /** We keep rendering the default content */
        }

        // Always return default content if anything goes wrong
        return renderExtension(
          children,
          layout,
          {
            isTopLevel: path.length < 1,
          },
          removeOverflow,
        );
      }}
    </ExtensionRenderer>
  );
};

export default BodiedExtension;
