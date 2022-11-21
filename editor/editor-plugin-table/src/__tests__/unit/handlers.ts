import { PluginKey, TextSelection } from 'prosemirror-state';

import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tr,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TablePluginState } from '../../plugins/table/types';
import { handleDocOrSelectionChanged } from '../../plugins/table/handlers';
import { pluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import { defaultTableSelection } from '../../plugins/table/pm-plugins/default-table-selection';
import tablePlugin from '../../plugins/table-plugin';

describe('table action handlers', () => {
  let editor: any;
  let defaultPluginState: any;

  beforeEach(() => {
    const createEditor = createProsemirrorEditorFactory();
    const preset = new Preset<LightEditorPlugin>().add(tablePlugin);

    editor = (doc: DocBuilder) =>
      createEditor<TablePluginState, PluginKey>({
        doc,
        preset,
        pluginKey,
      });

    defaultPluginState = {
      ...defaultTableSelection,
      pluginConfig: {},
      editorHasFocus: true,
      isNumberColumnEnabled: false,
      isHeaderColumnEnabled: false,
      isHeaderRowEnabled: false,
    };
  });

  describe('#handleDocOrSelectionChanged', () => {
    it('should return a new state with updated tableNode prop and reset selection', () => {
      const pluginState = {
        ...defaultPluginState,
        hoveredColumns: [1, 2, 3],
        hoveredRows: [1, 2, 3],
        isInDanger: true,
        tableNode: undefined,
        targetCellPosition: undefined,
        ordering: undefined,
        resizeHandleColumnIndex: undefined,
      };
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );
      const { state } = editorView;
      const cursorPos = 8;
      editorView.dispatch(
        state.tr.setSelection(new TextSelection(state.doc.resolve(cursorPos))),
      );

      const newState = handleDocOrSelectionChanged(
        editorView.state.tr,
        pluginState,
      );

      expect(newState).toEqual({
        ...pluginState,
        ...defaultTableSelection,
        tableNode: editorView.state.doc.firstChild,
        targetCellPosition: cursorPos - 2,
      });
    });
  });
});
