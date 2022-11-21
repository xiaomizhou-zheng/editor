import { ReadonlyTransaction } from 'prosemirror-state';

import { pluginFactory } from '@atlaskit/editor-common/utils';
import { ColumnResizingPluginState } from '../../types';

import { pluginKey } from './plugin-key';
import reducer from './reducer';

function mapping(
  tr: ReadonlyTransaction,
  pluginState: ColumnResizingPluginState,
): ColumnResizingPluginState {
  if (pluginState && pluginState.resizeHandlePos !== null) {
    return {
      ...pluginState,
      resizeHandlePos: tr.mapping.map(pluginState.resizeHandlePos),
    };
  }
  return pluginState;
}

const factory = pluginFactory(pluginKey, reducer, {
  mapping,
});

export const createCommand = factory.createCommand;
export const createPluginState = factory.createPluginState;
export const getPluginState = factory.getPluginState;
