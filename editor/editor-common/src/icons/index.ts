import React from 'react';

import Loadable from 'react-loadable';

import { IconProps } from '../types';

export { PanelInfoIcon } from './shared/PanelInfoIcon';
export { PanelWarningIcon } from './shared/PanelWarningIcon';
export { PanelErrorIcon } from './shared/PanelErrorIcon';
export { PanelSuccessIcon } from './shared/PanelSuccessIcon';
export { PanelNoteIcon } from './shared/PanelNoteIcon';

export const IconTable = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_editor-icon-table" */ '../icons/shared/table'
    ).then((module) => module.default) as Promise<
      React.ComponentType<IconProps>
    >,
  loading: () => null,
});
