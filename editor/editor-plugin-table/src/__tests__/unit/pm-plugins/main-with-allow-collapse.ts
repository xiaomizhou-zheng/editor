import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tdCursor,
  tdEmpty,
  tr,
  expand,
  bodiedExtension,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { TablePluginState } from '../../../plugins/table/types';
import { handleDocOrSelectionChanged } from '../../../plugins/table/handlers';
import expandPlugin from '@atlaskit/editor-core/src/plugins/expand';
import extensionPlugin from '@atlaskit/editor-core/src/plugins/extension';

describe('tables: main plugin with allowCollapse: true', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(tablePlugin)
        .add(expandPlugin)
        .add(extensionPlugin),
      pluginKey,
    });
  const baseTablePluginState: TablePluginState = {
    editorHasFocus: true,
    hoveredColumns: [],
    hoveredRows: [],
    pluginConfig: {
      allowCollapse: true,
    },
    isHeaderColumnEnabled: false,
    isHeaderRowEnabled: true,
  };

  it.each<[string, DocBuilder, object]>([
    [
      'should set canCollapseTable & !isTableCollapsed when table is on doc',
      doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      {
        canCollapseTable: true,
        isTableCollapsed: false,
      },
    ],
    [
      'should set !canCollapseTable & isTableCollapsed when table is in expand',
      doc(
        expand({ title: '' })(
          table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty)),
        ),
      ),
      {
        canCollapseTable: false,
        isTableCollapsed: true,
      },
    ],
    [
      'should set !canCollapseTable & !isTableCollapsed when table is in bodiedExtension',
      doc(
        bodiedExtension({
          extensionKey: 'bodied-eh',
          extensionType: 'com.floofs',
        })(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        p(),
      ),
      {
        canCollapseTable: false,
        isTableCollapsed: false,
      },
    ],
  ])('%s', (_, docBuilder, expected) => {
    const { editorView } = editor(docBuilder);
    const pluginState = {
      ...baseTablePluginState,
    };

    const oldState = handleDocOrSelectionChanged(
      editorView.state.tr,
      pluginState,
    );

    const newState = handleDocOrSelectionChanged(editorView.state.tr, oldState);

    expect(newState).toEqual({
      ...oldState,
      ...expected,
    });
  });
});
