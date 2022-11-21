import { Node as PMNode } from 'prosemirror-model';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TableAttributes } from '@atlaskit/adf-schema';
import { TablePluginState } from '../../../plugins/table/types';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import tablePlugin from '../../../plugins/table';
import TableView from '../../../plugins/table/nodeviews/table';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import type { EditorProps } from '@atlaskit/editor-core';
import { EditorView } from 'prosemirror-view';
import { hoverRows } from '../../../plugins/table/commands';

describe('table -> nodeviews -> table.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const createTableNode = (attrs?: TableAttributes) => (...args: any) =>
    table(attrs)(...args)(defaultSchema);

  const editor = (doc: DocBuilder, props?: EditorProps) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: false,
        dangerouslyAppendPlugins: {
          __plugins: [tablePlugin()],
        },
        ...props,
      },
      pluginKey,
    });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('TableView', () => {
    describe('with tableRenderOptimization', () => {
      describe('on view update', () => {
        let tableNode: PMNode,
          tableNodeView: TableView,
          renderSpy: jest.SpyInstance,
          view: EditorView;
        beforeEach(() => {
          tableNode = createTableNode({
            isNumberColumnEnabled: true,
          })(tr(td()(p('{<>}text')), tdEmpty, tdEmpty));
          const { editorView, portalProviderAPI, eventDispatcher } = editor(
            doc(
              p('text'),
              table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty)),
            ),
            {
              featureFlags: { tableRenderOptimization: true },
            },
          );
          view = editorView;
          tableNodeView = new TableView({
            node: tableNode,
            allowColumnResizing: false,
            view: editorView,
            portalProviderAPI,
            eventDispatcher,
            getPos: () => 1,
            tableRenderOptimization: true,
            getEditorContainerWidth: () => ({ width: 500 }),
            getEditorFeatureFlags: () => ({}),
            hasIntlContext: true,
          }).init();

          renderSpy = jest.spyOn(tableNodeView, 'render');
        });

        it('does not rerender if attributes or table width did not change', () => {
          const newNodeWithUnchangedAttributesOrWidth = createTableNode({
            isNumberColumnEnabled: true,
          })(tr(td()(p('{<>}text1')), tdEmpty, tdEmpty));
          tableNodeView.update(newNodeWithUnchangedAttributesOrWidth, []);
          expect(renderSpy).not.toHaveBeenCalled();
        });

        it('rerenders when table width changes', () => {
          const newNodeWithUnchangedAttributesAndExtraColumn = createTableNode({
            isNumberColumnEnabled: true,
          })(tr(td()(p('{<>}text1')), tdEmpty, tdEmpty, tdEmpty));
          tableNodeView.update(
            newNodeWithUnchangedAttributesAndExtraColumn,
            [],
          );
          expect(renderSpy).toHaveBeenCalled();
        });

        it('rerenders when attributes change', () => {
          const newNodeWithChangedAttributes = createTableNode({
            isNumberColumnEnabled: false,
          })(tr(td()(p('{<>}text1')), tdEmpty));

          tableNodeView.update(newNodeWithChangedAttributes, []);
          expect(renderSpy).toHaveBeenCalled();
        });

        it('rerenders when hovered rows change but attributes dont change', () => {
          const newNodeWithUnchangedAttributes = createTableNode({
            isNumberColumnEnabled: true,
          })(tr(td()(p('{<>}text1')), tdEmpty));

          hoverRows([1])(view.state, view.dispatch);
          tableNodeView.update(newNodeWithUnchangedAttributes, []);
          expect(renderSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
