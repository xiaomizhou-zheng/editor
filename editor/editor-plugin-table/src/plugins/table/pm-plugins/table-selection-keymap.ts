import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';

import {
  bindKeymapWithCommand,
  moveRight,
  moveLeft,
} from '@atlaskit/editor-common/keymaps';
import { arrowLeftFromTable, arrowRightFromTable } from '../commands/selection';

export function tableSelectionKeymapPlugin(
  editorSelectionAPI: EditorSelectionAPI | undefined | null,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    moveRight.common!,
    arrowRightFromTable(editorSelectionAPI)(),
    list,
  );

  bindKeymapWithCommand(
    moveLeft.common!,
    arrowLeftFromTable(editorSelectionAPI)(),
    list,
  );

  return keymap(list) as SafePlugin;
}

export default tableSelectionKeymapPlugin;
