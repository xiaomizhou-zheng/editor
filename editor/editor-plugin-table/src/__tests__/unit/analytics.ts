import { Rect } from '@atlaskit/editor-tables/table-map';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  thEmpty,
  tdEmpty,
  tdCursor,
  td,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { B50 } from '@atlaskit/theme/colors';

import { TablePluginState, PluginConfig } from '../../plugins/table/types';
import {
  deleteTableWithAnalytics,
  emptyMultipleCellsWithAnalytics,
  mergeCellsWithAnalytics,
  splitCellWithAnalytics,
  setColorWithAnalytics,
  toggleHeaderRowWithAnalytics,
  toggleHeaderColumnWithAnalytics,
  toggleNumberColumnWithAnalytics,
  toggleTableLayoutWithAnalytics,
  insertRowWithAnalytics,
  insertColumnWithAnalytics,
  deleteRowsWithAnalytics,
  deleteColumnsWithAnalytics,
  deleteTableIfSelectedWithAnalytics,
} from '../../plugins/table/commands-with-analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { handleCut } from '../../plugins/table/event-handlers';
import { pluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import { replaceSelectedTable } from '../../plugins/table/transforms';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import tablePlugin from '../../plugins/table-plugin';

const defaultTable = table()(
  tr(thEmpty, thEmpty, thEmpty),
  tr(tdEmpty, tdEmpty, tdEmpty),
  tr(tdEmpty, tdEmpty, tdCursor),
);

const secondRow: Rect = { left: 0, top: 1, bottom: 2, right: 3 };
const secondColumn: Rect = { left: 1, top: 0, bottom: 3, right: 2 };

describe('Table analytic events', () => {
  let editorAnalyticsAPIFake: EditorAnalyticsAPI;
  const analyticFireMock = jest.fn().mockReturnValue(jest.fn());

  beforeEach(() => {
    editorAnalyticsAPIFake = {
      attachAnalyticsEvent: analyticFireMock,
    };
  });

  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts: 'all',
    } as PluginConfig;

    const _editor = createEditor({
      doc,
      editorProps: {
        allowTables: false,
        allowAnalyticsGASV3: true,
        appearance: 'full-page',
        quickInsert: true,
        dangerouslyAppendPlugins: {
          __plugins: [
            tablePlugin({
              tableOptions,
              editorAnalyticsAPI: editorAnalyticsAPIFake,
            }),
          ],
        },
      },
      pluginKey,
    });

    return _editor;
  };

  describe('table inserted via quickInsert', () => {
    beforeEach(async () => {
      const { typeAheadTool } = editor(doc(p('{<>}')));
      typeAheadTool.searchQuickInsert('Table').insert({ index: 0 });
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'table',
        attributes: expect.objectContaining({ inputMethod: 'quickInsert' }),
        eventType: 'track',
      });
    });
  });

  describe('table deleted', () => {
    beforeEach(() => {
      const { editorView } = editor(doc(defaultTable));
      deleteTableWithAnalytics(editorAnalyticsAPIFake)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'deleted',
        actionSubject: 'table',
        attributes: expect.objectContaining({
          inputMethod: 'floatingToolbar',
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('table deleted if selected', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(td()(p('{<cell}1')), td()(p('2'))),
            tr(td()(p('3')), td()(p('4{cell>}'))),
          ),
        ),
      );
      deleteTableIfSelectedWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.KEYBOARD,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'deleted',
        actionSubject: 'table',
        attributes: expect.objectContaining({
          inputMethod: 'keyboard',
          totalRowCount: 2,
          totalColumnCount: 2,
        }),
        eventType: 'track',
      });
    });
  });

  describe('table cleared', () => {
    describe('context menu', () => {
      beforeEach(() => {
        const { editorView } = editor(
          doc(
            table()(
              tr(thEmpty, td()(p('{<cell}Hello')), thEmpty),
              tr(td()(p('Hello')), tdEmpty, tdEmpty),
              tr(tdEmpty, td()(p('{cell>}')), tdEmpty),
            ),
          ),
        );

        emptyMultipleCellsWithAnalytics(editorAnalyticsAPIFake)(
          INPUT_METHOD.CONTEXT_MENU,
        )(editorView.state, editorView.dispatch);
      });

      it('should fire v3 analytics', () => {
        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'cleared',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            inputMethod: 'contextMenu',
            verticalCells: 3,
            horizontalCells: 1,
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });

    describe('keyboard - Backspace', () => {
      beforeEach(() => {
        const { editorView } = editor(
          doc(
            table()(
              tr(thEmpty, td()(p('Hello')), thEmpty),
              tr(td()(p('{<cell}Hello')), tdEmpty, td()(p('{cell>}'))),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        sendKeyToPm(editorView, 'Backspace');
      });

      it('should fire v3 analytics', () => {
        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'cleared',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            inputMethod: 'keyboard',
            verticalCells: 1,
            horizontalCells: 3,
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });
  });

  describe('cells merged', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td()(p('{<cell}Hello')), thEmpty),
            tr(td()(p('Hello')), tdEmpty, tdEmpty),
            tr(tdEmpty, td()(p('{cell>}')), tdEmpty),
          ),
        ),
      );

      mergeCellsWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.CONTEXT_MENU,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'merged',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          verticalCells: 3,
          horizontalCells: 1,
          totalCells: 3,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('cell split', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty),
            tr(td({ colspan: 3 })(p('{<>}'))),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      splitCellWithAnalytics(editorAnalyticsAPIFake)(INPUT_METHOD.CONTEXT_MENU)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'split',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          verticalCells: 1,
          horizontalCells: 3,
          totalCells: 3,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('cells colored', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td()(p('Hello')), thEmpty),
            tr(td()(p('{<cell}Hello')), tdEmpty, td()(p('{cell>}'))),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      setColorWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.CONTEXT_MENU,
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        B50,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'colored',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          cellColor: 'light blue',
          verticalCells: 1,
          horizontalCells: 3,
          totalCells: 3,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('header row toggled', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTable);
      toggleHeaderRowWithAnalytics(editorAnalyticsAPIFake)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'toggledHeaderRow',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          newState: false,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('header column toggled', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTable);
      toggleHeaderColumnWithAnalytics(editorAnalyticsAPIFake)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'toggledHeaderColumn',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          newState: true,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('number column toggled', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTable);
      toggleNumberColumnWithAnalytics(editorAnalyticsAPIFake)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'toggledNumberColumn',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          newState: true,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('layout changed', () => {
    describe('normal', () => {
      it('should fire v3 analytics', () => {
        const { editorView } = editor(defaultTable);
        toggleTableLayoutWithAnalytics(editorAnalyticsAPIFake)(
          editorView.state,
          editorView.dispatch,
        );

        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'changedBreakoutMode',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            newBreakoutMode: 'wide',
            previousBreakoutMode: 'normal',
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });

    describe('wide', () => {
      it('should fire v3 analytics', () => {
        const { editorView } = editor(
          doc(
            table({
              layout: 'wide',
            })(
              tr(thEmpty, thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdCursor),
            ),
          ),
        );
        toggleTableLayoutWithAnalytics(editorAnalyticsAPIFake)(
          editorView.state,
          editorView.dispatch,
        );

        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'changedBreakoutMode',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            newBreakoutMode: 'fullWidth',
            previousBreakoutMode: 'wide',
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });

    describe('fullWidth', () => {
      it('should fire v3 analytics', () => {
        const { editorView } = editor(
          doc(
            table({ layout: 'full-width' })(
              tr(thEmpty, thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdCursor),
            ),
          ),
        );

        toggleTableLayoutWithAnalytics(editorAnalyticsAPIFake)(
          editorView.state,
          editorView.dispatch,
        );

        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'changedBreakoutMode',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            newBreakoutMode: 'normal',
            previousBreakoutMode: 'fullWidth',
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });
  });

  describe('cut something from table', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td()(p('Hello')), thEmpty),
            tr(td()(p('{<cell}Hello')), tdEmpty, td()(p('{cell>}'))),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      editorView.dispatch(
        handleCut(
          editorView.state.tr,
          editorView.state,
          editorView.state,
          editorAnalyticsAPIFake,
        ),
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'cut',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          verticalCells: 1,
          horizontalCells: 3,
          totalCells: 3,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('row added', () => {
    describe('context menu', () => {
      beforeEach(() => {
        const { editorView } = editor(defaultTable);
        insertRowWithAnalytics(editorAnalyticsAPIFake)(
          INPUT_METHOD.CONTEXT_MENU,
          {
            index: 2,
            moveCursorToInsertedRow: false,
          },
        )(editorView.state, editorView.dispatch);
      });

      it('should fire v3 analytics', () => {
        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'addedRow',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            inputMethod: 'contextMenu',
            position: 2,
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });

    describe('keyboard', () => {
      describe('Tab', () => {
        beforeEach(() => {
          const { editorView } = editor(defaultTable);
          sendKeyToPm(editorView, 'Tab');
        });

        it('should fire v3 analytics', () => {
          expect(analyticFireMock).toHaveBeenCalledWith({
            action: 'addedRow',
            actionSubject: 'table',
            actionSubjectId: null,
            attributes: expect.objectContaining({
              inputMethod: 'keyboard',
              position: 3,
              totalRowCount: 3,
              totalColumnCount: 3,
            }),
            eventType: 'track',
          });
        });
      });

      describe('Shift-Tab', () => {
        beforeEach(() => {
          const { editorView } = editor(
            doc(
              table()(
                tr(tdCursor, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );
          sendKeyToPm(editorView, 'Shift-Tab');
        });

        it('should fire v3 analytics', () => {
          expect(analyticFireMock).toHaveBeenCalledWith({
            action: 'addedRow',
            actionSubject: 'table',
            actionSubjectId: null,
            attributes: expect.objectContaining({
              inputMethod: 'keyboard',
              position: 0,
              totalRowCount: 3,
              totalColumnCount: 3,
            }),
            eventType: 'track',
          });
        });
      });
    });
  });

  describe('column added', () => {
    const getEditorContainerWidth = () => {
      return { width: 500 };
    };
    beforeEach(() => {
      const { editorView } = editor(defaultTable);
      insertColumnWithAnalytics(
        getEditorContainerWidth,
        editorAnalyticsAPIFake,
      )(INPUT_METHOD.CONTEXT_MENU, 2)(
        editorView.state,
        editorView.dispatch,
        editorView,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'addedColumn',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          inputMethod: 'contextMenu',
          position: 2,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('row deleted', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTable);
      deleteRowsWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.CONTEXT_MENU,
        secondRow,
        true,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'deletedRow',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          inputMethod: 'contextMenu',
          position: 1,
          count: 1,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('column deleted', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTable);
      deleteColumnsWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.CONTEXT_MENU,
        secondColumn,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'deletedColumn',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          inputMethod: 'contextMenu',
          position: 1,
          count: 1,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('table replaced', () => {
    it('should fire v3 analytics', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(td()(p('{<cell}1')), td()(p('2'))),
            tr(td()(p('3')), td()(p('4{cell>}'))),
          ),
        ),
      );
      editorView.dispatch(
        replaceSelectedTable(
          editorView.state,
          'text',
          INPUT_METHOD.KEYBOARD,
          editorAnalyticsAPIFake,
        ),
      );

      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'replaced',
        actionSubject: 'table',
        attributes: expect.objectContaining({
          totalRowCount: 2,
          totalColumnCount: 2,
          inputMethod: 'keyboard',
        }),
        eventType: 'track',
      });
    });
  });
});
