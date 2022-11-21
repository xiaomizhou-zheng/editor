import React from 'react';

import type { Schema } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { browser } from '@atlaskit/editor-common/utils';
import { tableEditing } from '@atlaskit/editor-tables/pm-plugins';
import { createTable } from '@atlaskit/editor-tables/utils';

import { table, tableCell, tableHeader, tableRow } from '@atlaskit/adf-schema';

import { toggleTable, tooltip } from '@atlaskit/editor-common/keymaps';

import type { EditorPlugin } from '@atlaskit/editor-common/types';
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  TABLE_ACTION,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';

import { IconTable } from '@atlaskit/editor-common/icons';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';

import { pluginConfig } from './create-plugin-config';
import { createPlugin as createTableLocalIdPlugin } from './pm-plugins/table-local-id';
import { createPlugin as createTableSafariDelayedDomSelectionSyncingWorkaroundPlugin } from './pm-plugins/safari-delayed-dom-selection-syncing-workaround';
import { createPlugin as createTableSafariDeleteCompositionTextIssueWorkaroundPlugin } from './pm-plugins/safari-delete-composition-text-issue-workaround';
import { createPlugin as createDecorationsPlugin } from './pm-plugins/decorations/plugin';
import { keymapPlugin } from './pm-plugins/keymap';
import { tableSelectionKeymapPlugin } from './pm-plugins/table-selection-keymap';
import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import {
  createPlugin as createStickyHeadersPlugin,
  findStickyHeaderForTable,
  pluginKey as stickyHeadersPluginKey,
} from './pm-plugins/sticky-headers';
import {
  createPlugin as createFlexiResizingPlugin,
  pluginKey as tableResizingPluginKey,
} from './pm-plugins/table-resizing';
import { getToolbarConfig } from './toolbar';
import { ColumnResizingPluginState, PluginConfig } from './types';
import FloatingContextualButton from './ui/FloatingContextualButton';
import FloatingContextualMenu from './ui/FloatingContextualMenu';
import FloatingDeleteButton from './ui/FloatingDeleteButton';
import FloatingInsertButton from './ui/FloatingInsertButton';
import LayoutButton from './ui/LayoutButton';
import { isLayoutSupported } from './utils';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import type {
  GetEditorContainerWidth,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import { EditorState, Transaction } from 'prosemirror-state';

interface TablePluginOptions {
  tableOptions: PluginConfig;
  breakoutEnabled?: boolean;
  allowContextualMenu?: boolean;
  // TODO these two need to be rethought
  fullWidthEnabled?: boolean;
  wasFullWidthEnabled?: boolean;
  editorAnalyticsAPI?: EditorAnalyticsAPI;
  editorSelectionAPI?: EditorSelectionAPI;
  getEditorFeatureFlags?: GetEditorFeatureFlags;
}

const defaultGetEditorFeatureFlags = () => ({});

const tablesPlugin = (options?: TablePluginOptions): EditorPlugin => {
  const editorViewRef: Record<'current', EditorView | null> = { current: null };
  const defaultGetEditorContainerWidth: GetEditorContainerWidth = () => {
    if (!editorViewRef.current) {
      return {
        width: document?.body?.offsetWidth || 500,
      };
    }

    const {
      current: { state },
    } = editorViewRef;

    // TODO: ED-15663
    // Please, do not copy or use this kind of code below
    // @ts-ignore
    return (state as any)['widthPlugin$'];
  };

  return {
    name: 'table',

    nodes() {
      return [
        { name: 'table', node: table },
        { name: 'tableHeader', node: tableHeader },
        { name: 'tableRow', node: tableRow },
        { name: 'tableCell', node: tableCell },
      ];
    },

    pmPlugins() {
      const plugins: ReturnType<NonNullable<EditorPlugin['pmPlugins']>> = [
        {
          name: 'table',
          plugin: ({
            dispatchAnalyticsEvent,
            dispatch,
            portalProviderAPI,
            eventDispatcher,
          }) => {
            const {
              fullWidthEnabled,
              wasFullWidthEnabled,
              breakoutEnabled,
              tableOptions,
              editorAnalyticsAPI,
              getEditorFeatureFlags,
            } = options || ({} as TablePluginOptions);
            return createPlugin(
              dispatchAnalyticsEvent,
              dispatch,
              portalProviderAPI,
              eventDispatcher,
              pluginConfig(tableOptions),

              defaultGetEditorContainerWidth,
              getEditorFeatureFlags || defaultGetEditorFeatureFlags,
              breakoutEnabled,
              fullWidthEnabled,
              wasFullWidthEnabled,
              editorAnalyticsAPI,
            );
          },
        },
        {
          name: 'tablePMColResizing',
          plugin: ({ dispatch }) => {
            const {
              fullWidthEnabled,
              tableOptions,
              editorAnalyticsAPI,
              getEditorFeatureFlags,
            } = options || ({} as TablePluginOptions);
            const { allowColumnResizing } = pluginConfig(tableOptions);
            return allowColumnResizing
              ? createFlexiResizingPlugin(
                  dispatch,
                  {
                    lastColumnResizable: !fullWidthEnabled,
                  } as ColumnResizingPluginState,
                  defaultGetEditorContainerWidth,
                  getEditorFeatureFlags || defaultGetEditorFeatureFlags,
                  editorAnalyticsAPI,
                )
              : undefined;
          },
        },
        { name: 'tableEditing', plugin: () => createDecorationsPlugin() },
        // Needs to be lower priority than editor-tables.tableEditing
        // plugin as it is currently swallowing backspace events inside tables
        {
          name: 'tableKeymap',
          plugin: () =>
            keymapPlugin(
              defaultGetEditorContainerWidth,
              options?.editorAnalyticsAPI,
            ),
        },
        {
          name: 'tableSelectionKeymap',
          plugin: () => tableSelectionKeymapPlugin(options?.editorSelectionAPI),
        },
        {
          name: 'tableEditing',
          plugin: () =>
            tableEditing({
              reportFixedTable: ({
                state,
                tr,
                reason,
              }: {
                state: EditorState;
                tr: Transaction;
                reason: string;
              }) => {
                options?.editorAnalyticsAPI?.attachAnalyticsEvent({
                  action: TABLE_ACTION.FIXED,
                  actionSubject: ACTION_SUBJECT.TABLE,
                  actionSubjectId: null,
                  attributes: {
                    reason,
                  },
                  eventType: EVENT_TYPE.TRACK,
                })(tr);
              },
            }) as SafePlugin,
        },
        {
          name: 'tableStickyHeaders',
          plugin: ({ dispatch, eventDispatcher }) =>
            options && options.tableOptions.stickyHeaders
              ? createStickyHeadersPlugin(
                  dispatch,
                  eventDispatcher,
                  () => [],
                  options?.getEditorFeatureFlags ||
                    defaultGetEditorFeatureFlags,
                )
              : undefined,
        },

        {
          name: 'tableLocalId',
          plugin: ({ dispatch }) => createTableLocalIdPlugin(dispatch),
        },

        {
          name: 'tableGetEditorViewReferencePlugin',
          plugin: () => {
            return new SafePlugin({
              view: (editorView) => {
                editorViewRef.current = editorView;
                return {
                  destroy: () => {
                    editorViewRef.current = null;
                  },
                };
              },
            });
          },
        },
      ];

      // workaround for prosemirrors delayed dom selection syncing during pointer drag
      // causing issues with table selections in Safari
      // https://github.com/ProseMirror/prosemirror-view/commit/885258b80551ac87b81601d3ed25f552aeb22293

      // NOTE: this workaround can be removed when next upgrading prosemirror as the issue will be fixed
      // https://github.com/ProseMirror/prosemirror-view/pull/116
      if (browser.safari) {
        plugins.push({
          name: 'tableSafariDelayedDomSelectionSyncingWorkaround',
          plugin: () => {
            return createTableSafariDelayedDomSelectionSyncingWorkaroundPlugin();
          },
        });
      }

      // Workaround for table element breaking issue caused by composition event with an inputType of deleteCompositionText.
      // https://github.com/ProseMirror/prosemirror/issues/934
      if (browser.safari) {
        plugins.push({
          name: 'tableSafariDeleteCompositionTextIssueWorkaround',
          plugin: () => {
            return createTableSafariDeleteCompositionTextIssueWorkaroundPlugin();
          },
        });
      }

      return plugins;
    },

    contentComponent({
      editorView,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      dispatchAnalyticsEvent,
    }) {
      return (
        <ErrorBoundary
          component={ACTION_SUBJECT.TABLES_PLUGIN}
          dispatchAnalyticsEvent={dispatchAnalyticsEvent}
          fallbackComponent={null}
        >
          <WithPluginState
            plugins={{
              tablePluginState: pluginKey,
              tableResizingPluginState: tableResizingPluginKey,
              stickyHeadersState: stickyHeadersPluginKey,
            }}
            render={({
              tableResizingPluginState: resizingPluginState,
              stickyHeadersState,
              tablePluginState,
            }) => {
              const { state } = editorView;
              const isDragging = resizingPluginState?.dragging;
              const {
                tableNode,
                tablePos,
                targetCellPosition,
                isContextualMenuOpen,
                layout,
                tableRef,
                pluginConfig,
                insertColumnButtonIndex,
                insertRowButtonIndex,
                isHeaderColumnEnabled,
                isHeaderRowEnabled,
                tableWrapperTarget,
              } = tablePluginState!;

              const { allowControls } = pluginConfig;

              const stickyHeader = stickyHeadersState
                ? findStickyHeaderForTable(stickyHeadersState, tablePos)
                : undefined;

              return (
                <>
                  {targetCellPosition &&
                    tableRef &&
                    !isDragging &&
                    options &&
                    options.allowContextualMenu && (
                      <FloatingContextualButton
                        isNumberColumnEnabled={
                          tableNode && tableNode.attrs.isNumberColumnEnabled
                        }
                        editorView={editorView}
                        tableNode={tableNode}
                        mountPoint={popupsMountPoint}
                        targetCellPosition={targetCellPosition}
                        scrollableElement={popupsScrollableElement}
                        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                        isContextualMenuOpen={isContextualMenuOpen}
                        layout={layout}
                        stickyHeader={stickyHeader}
                      />
                    )}
                  {allowControls && (
                    <FloatingInsertButton
                      tableNode={tableNode}
                      tableRef={tableRef}
                      insertColumnButtonIndex={insertColumnButtonIndex}
                      insertRowButtonIndex={insertRowButtonIndex}
                      isHeaderColumnEnabled={isHeaderColumnEnabled}
                      isHeaderRowEnabled={isHeaderRowEnabled}
                      editorView={editorView}
                      mountPoint={popupsMountPoint}
                      boundariesElement={popupsBoundariesElement}
                      scrollableElement={popupsScrollableElement}
                      hasStickyHeaders={stickyHeader && stickyHeader.sticky}
                      dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                      editorAnalyticsAPI={options?.editorAnalyticsAPI}
                      getEditorContainerWidth={defaultGetEditorContainerWidth}
                    />
                  )}
                  <FloatingContextualMenu
                    editorView={editorView}
                    mountPoint={popupsMountPoint}
                    boundariesElement={popupsBoundariesElement}
                    targetCellPosition={targetCellPosition}
                    isOpen={Boolean(isContextualMenuOpen)}
                    pluginConfig={pluginConfig}
                    editorAnalyticsAPI={options?.editorAnalyticsAPI}
                    getEditorContainerWidth={defaultGetEditorContainerWidth}
                  />
                  {allowControls && (
                    <FloatingDeleteButton
                      editorView={editorView}
                      selection={editorView.state.selection}
                      tableRef={tableRef as HTMLTableElement}
                      mountPoint={popupsMountPoint}
                      boundariesElement={popupsBoundariesElement}
                      scrollableElement={popupsScrollableElement}
                      stickyHeaders={stickyHeader}
                      isNumberColumnEnabled={
                        tableNode && tableNode.attrs.isNumberColumnEnabled
                      }
                      editorAnalyticsAPI={options?.editorAnalyticsAPI}
                    />
                  )}
                  {isLayoutSupported(state) &&
                    options &&
                    options.breakoutEnabled && (
                      <LayoutButton
                        editorView={editorView}
                        mountPoint={popupsMountPoint}
                        boundariesElement={popupsBoundariesElement}
                        scrollableElement={popupsScrollableElement}
                        targetRef={tableWrapperTarget!}
                        layout={layout}
                        isResizing={
                          !!resizingPluginState &&
                          !!resizingPluginState.dragging
                        }
                        stickyHeader={stickyHeader}
                        editorAnalyticsAPI={options?.editorAnalyticsAPI}
                      />
                    )}
                </>
              );
            }}
          />
        </ErrorBoundary>
      );
    },

    pluginsOptions: {
      // TODO: ED-14676 This is not the final API design
      // For now, we are using this on (insert-api/api.ts) but we may create a proper place for it
      createNodeHandler: ({
        nodeName,
        schema,
      }: {
        nodeName: string;
        schema: Schema;
      }) => {
        // An EditorPlugin may manage more than one node.
        if (nodeName !== 'table') {
          return null;
        }

        const table = createTable({
          schema,
        });

        return table;
      },
      quickInsert: ({ formatMessage }) => [
        {
          id: 'table',
          title: formatMessage(messages.table),
          description: formatMessage(messages.tableDescription),
          keywords: ['cell', 'table'],
          priority: 600,
          keyshortcut: tooltip(toggleTable),
          icon: () => <IconTable />,
          action(insert, state) {
            const tr = insert(
              createTable({
                schema: state.schema,
              }),
            );
            options?.editorAnalyticsAPI?.attachAnalyticsEvent({
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: ACTION_SUBJECT_ID.TABLE,
              attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
              eventType: EVENT_TYPE.TRACK,
            })(tr);
            return tr;
          },
        },
      ],
      floatingToolbar: getToolbarConfig(
        defaultGetEditorContainerWidth,
        options?.editorAnalyticsAPI,
        options?.getEditorFeatureFlags || defaultGetEditorFeatureFlags,
      )(pluginConfig(options?.tableOptions)),
    },
  };
};

export default tablesPlugin;
