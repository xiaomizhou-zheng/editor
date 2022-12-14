import React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { replaceRaf } from 'raf-stub';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import tablePlugin from '../../../plugins/table-plugin';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
  tdCursor,
  DocBuilder,
  thEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { findTable, selectTable } from '@atlaskit/editor-tables/utils';
import {
  TableCssClassName as ClassName,
  TablePluginState,
} from '../../../plugins/table/types';
import TableComponent from '../../../plugins/table/nodeviews/TableComponent';
import { OverflowShadowsObserver } from '../../../plugins/table/nodeviews/OverflowShadowsObserver';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { toggleNumberColumn } from '../../../plugins/table/commands';
import {
  pluginKey as stickyHeadersPluginKey,
  StickyPluginState,
} from '../../../plugins/table/pm-plugins/sticky-headers';
import { tablesHaveDifferentColumnWidths } from '../../../plugins/table/utils/nodes';

jest.mock('../../../plugins/table/utils/nodes', () =>
  Object.assign({}, jest.requireActual('../../../plugins/table/utils/nodes'), {
    tablesHaveDifferentColumnWidths: jest.fn(),
  }),
);

// with this jest will load mocked class from the relative __mocks__ folder
jest.mock('../../../plugins/table/nodeviews/OverflowShadowsObserver');

replaceRaf();
const requestAnimationFrame = window.requestAnimationFrame as any;

describe('table -> nodeviews -> TableComponent.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  //
  const getEditorFeatureFlags = jest.fn();
  //
  const editor = (
    doc: DocBuilder,
    featureFlags?: { [featureFlag: string]: string | boolean },
  ) => {
    getEditorFeatureFlags.mockReturnValue(featureFlags || {});
    return createEditor({
      doc,
      editorProps: {
        allowTables: false,
        dangerouslyAppendPlugins: {
          __plugins: [tablePlugin()],
        },
        featureFlags,
      },
      pluginKey,
    });
  };
  //
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the table is selected', () => {
    it('should add table selected css class', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdCursor))),
        {
          tableCellOptimization: true,
          tableRenderOptimization: true,
          stickyHeadersOptimization: true,
          initialRenderOptimization: true,
        },
      );
      const { state, dispatch } = editorView;
      dispatch(selectTable(state.tr));
      requestAnimationFrame.step();
      const tableContainer = document.querySelector(
        `.${ClassName.TABLE_CONTAINER}`,
      );
      expect(
        tableContainer!.classList.contains(ClassName.TABLE_SELECTED),
      ).toBeTruthy();
    });
  });

  describe('when the numbered column attribute is changed', () => {
    it('should not resize the columns', () => {
      const { editorView } = editor(
        doc(
          table({ isNumberColumnEnabled: false, layout: 'default' })(
            tr(
              td({ colwidth: [1400] })(p('{<>}')),
              td({ colwidth: [48] })(p()),
              td({ colwidth: [48] })(p()),
            ),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      const tableCell = state.schema.nodes.tableCell;
      const columnWidths: number[][] = [];

      toggleNumberColumn(state, dispatch);
      requestAnimationFrame.step();

      editorView.state.doc.nodesBetween(3, 14, (node) => {
        if (node.type === tableCell) {
          columnWidths.push(node.attrs.colwidth);
        }

        return node.type !== tableCell;
      });

      expect(columnWidths).toEqual([[1400], [48], [48]]);
    });
  });

  describe('WITH_CONTROLS css class', () => {
    it.each<[string, object, boolean]>([
      [
        'is added when allowControls is set',
        {
          allowControls: true,
          tableActive: true,
        },
        true,
      ],
      [
        'is added by default when allowControls is not provided',
        {
          tableActive: true,
        },
        true,
      ],
      [
        'is not added when allowControls is false',
        {
          allowControls: false,
          tableActive: true,
        },
        false,
      ],
      [
        'is not added when table is not active',
        {
          allowControls: true,
          tableActive: false,
        },
        false,
      ],
    ])('%s', (_, props, expected) => {
      const { editorView: view } = editor(
        doc(p('text'), table()(tr(td()(p('{<>}text')), tdEmpty, tdEmpty))),
      );

      const tableF = findTable(view.state.selection);
      const getNode = () => tableF!.node;
      const wrapper = shallow(
        <TableComponent
          view={view}
          eventDispatcher={({ on: () => {} } as any) as EventDispatcher}
          // @ts-ignore
          containerWidth={{}}
          // @ts-ignore
          getNode={getNode}
          getEditorFeatureFlags={getEditorFeatureFlags}
          {...props}
        />,
      );

      expect(wrapper.hasClass(ClassName.WITH_CONTROLS)).toBe(expected);
    });
  });

  describe('overflowShadowOptimization', () => {
    let overflowShadowsConstructorSpy = jest.fn();
    let updateStickyShadowsSpy = jest.fn();
    let observeCellsSpy = jest.fn();
    let disposeSpy = jest.fn();
    beforeAll(() => {
      (OverflowShadowsObserver as any).setMock('observeCells', observeCellsSpy);
      (OverflowShadowsObserver as any).setMock('dispose', disposeSpy);
      (OverflowShadowsObserver as any).setMock(
        'updateStickyShadows',
        updateStickyShadowsSpy,
      );
      (OverflowShadowsObserver as any).setMock(
        'constructor',
        overflowShadowsConstructorSpy,
      );
    });

    afterAll(() => {
      (OverflowShadowsObserver as any).resetMocks();
    });

    let triggerDispatcherEvent: { [key: string]: any } = {};
    const tablePos = 0;

    function setupTable(tableOverflowShadowsOptimization: boolean = false) {
      const editorData = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty),
            tr(td()(p('{<>}text')), tdEmpty, tdEmpty),
          ),
        ),
        {
          tableOverflowShadowsOptimization,
        },
      );

      const view = editorData.editorView;
      const tableF = findTable(view.state.selection);

      const getNode = () => view.state.doc.firstChild!;
      const wrapper = mount(
        <TableComponent
          view={view}
          eventDispatcher={
            ({
              on: (key: string, action: Function) => {
                triggerDispatcherEvent[key] = action;
              },
              off: jest.fn(),
            } as any) as EventDispatcher
          }
          // @ts-ignore
          containerWidth={{}}
          pluginState={{
            pluginConfig: {
              allowControls: false,
            },
          }}
          getPos={() => tablePos}
          getNode={getNode}
          node={tableF!.node}
          contentDOM={(wrapper: HTMLElement | null) => {
            const node = view.dom.getElementsByTagName('table')[0];

            if (!wrapper?.firstChild) {
              wrapper?.appendChild(node);
            }
          }}
          getEditorFeatureFlags={getEditorFeatureFlags}
        />,
      );

      return { wrapper, view };
    }

    describe('with optimization on', () => {
      let wrapper: ReactWrapper;
      beforeEach(() => {
        wrapper = setupTable(true).wrapper;
      });

      it('inits overflow shadows observer', () => {
        const tableWrapperNode = wrapper
          .find(`.${ClassName.TABLE_NODE_WRAPPER}`)
          .getDOMNode();
        const tableNode = tableWrapperNode.querySelector('table');
        wrapper.setProps({});
        expect(overflowShadowsConstructorSpy).toHaveBeenCalledWith(
          expect.any(Function),
          tableNode,
          tableWrapperNode,
        );
      });

      it('observes table cells on component update', () => {
        expect(observeCellsSpy).not.toHaveBeenCalled();
        wrapper.setProps({});
        expect(observeCellsSpy).toHaveBeenCalledTimes(1);
      });

      it('updates sticky shadows on sticky state changed', () => {
        const newStickyState: StickyPluginState = [
          {
            pos: tablePos + 1,
            top: 0,
            padding: 10,
            sticky: true,
          },
        ];
        triggerDispatcherEvent[(stickyHeadersPluginKey as any).key](
          newStickyState,
        );
        expect(updateStickyShadowsSpy).toHaveBeenCalled();
      });

      it('disposes shadows observer on unmount', () => {
        wrapper.setProps({});
        wrapper.unmount();
        expect(disposeSpy).toHaveBeenCalled();
      });
    });

    describe('with optimization off', () => {
      let wrapper: ReactWrapper;
      beforeEach(() => {
        wrapper = setupTable(false).wrapper;
      });

      it('does not init overflow shadows observer', () => {
        wrapper.setProps({});
        expect(overflowShadowsConstructorSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('when media fullscreen is changed', () => {
    function setupTable(isMediaFullscreen: boolean) {
      const editorData = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty),
            tr(td()(p('{<>}text')), tdEmpty, tdEmpty),
          ),
        ),
      );

      const view = editorData.editorView;
      const tableF = findTable(view.state.selection);
      let triggerDispatcherEvent: { [key: string]: any } = {};
      const getNode = () => view.state.doc.firstChild!;
      const tablePos = 0;

      const wrapper = mount(
        <TableComponent
          view={view}
          eventDispatcher={
            ({
              on: (key: string, action: Function) => {
                triggerDispatcherEvent[key] = action;
              },
              off: jest.fn(),
            } as any) as EventDispatcher
          }
          // @ts-ignore
          containerWidth={{}}
          pluginState={{
            pluginConfig: {
              allowControls: false,
            },
          }}
          getPos={() => tablePos}
          getNode={getNode}
          node={tableF!.node}
          contentDOM={(wrapper: HTMLElement | null) => {
            const node = view.dom.getElementsByTagName('table')[0];
            if (!wrapper?.firstChild) {
              wrapper?.appendChild(node);
            }
          }}
          isMediaFullscreen={isMediaFullscreen}
          allowColumnResizing={true}
          getEditorFeatureFlags={getEditorFeatureFlags}
        />,
      );
      return { wrapper, view };
    }

    it('when media is not fullscreen', () => {
      const wrapper = setupTable(false).wrapper;
      wrapper.setProps({});

      expect(tablesHaveDifferentColumnWidths).toHaveBeenCalled();
    });

    it('when media is fullscreen', () => {
      const wrapper = setupTable(true).wrapper;
      wrapper.setProps({});

      expect(tablesHaveDifferentColumnWidths).not.toHaveBeenCalled();
    });
  });
});
