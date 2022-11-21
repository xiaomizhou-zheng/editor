import React, { Component } from 'react';
import type { WrappedComponentProps } from 'react-intl-next';
import { defineMessages, injectIntl } from 'react-intl-next';

import classnames from 'classnames';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  findTable,
  isTableSelected,
  selectTable,
} from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';

import { clearHoverSelection, hoverTable } from '../../../commands';
import { TableCssClassName as ClassName } from '../../../types';

const messages = defineMessages({
  cornerControl: {
    id: 'fabric.editor.cornerControl',
    defaultMessage: 'Highlight table',
    description:
      'A button on the upper left corner of the table that shows up when the table is in focus. Clicking on it will select the entire table.',
  },
});

export interface Props {
  editorView: EditorView;
  tableRef?: HTMLTableElement;
  isInDanger?: boolean;
  isResizing?: boolean;
  hoveredRows?: number[];
  isHeaderColumnEnabled?: boolean;
  isHeaderRowEnabled?: boolean;
  stickyTop?: number;
}

class CornerControlComponent extends Component<
  Props & WrappedComponentProps,
  any
> {
  render() {
    const {
      isInDanger,
      tableRef,
      isHeaderColumnEnabled,
      isHeaderRowEnabled,
      intl: { formatMessage },
    } = this.props;
    if (!tableRef) {
      return null;
    }
    const isActive = this.isActive();

    return (
      <div
        className={classnames(ClassName.CORNER_CONTROLS, {
          active: isActive,
          sticky: this.props.stickyTop !== undefined,
        })}
        style={{
          top:
            this.props.stickyTop !== undefined
              ? `${this.props.stickyTop}px`
              : undefined,
        }}
        contentEditable={false}
      >
        <button
          aria-label={formatMessage(messages.cornerControl)}
          type="button"
          className={classnames(ClassName.CONTROLS_CORNER_BUTTON, {
            danger: isActive && isInDanger,
          })}
          onClick={this.selectTable}
          onMouseOver={this.hoverTable}
          onMouseOut={this.clearHoverSelection}
        />

        {!isHeaderRowEnabled && (
          <div className={ClassName.CORNER_CONTROLS_INSERT_ROW_MARKER}>
            <div className={ClassName.CONTROLS_INSERT_MARKER} />
          </div>
        )}
        {!isHeaderColumnEnabled && (
          <div className={ClassName.CORNER_CONTROLS_INSERT_COLUMN_MARKER}>
            <div className={ClassName.CONTROLS_INSERT_MARKER} />
          </div>
        )}
      </div>
    );
  }

  private isActive = () => {
    const { editorView, hoveredRows, isResizing } = this.props;
    const { selection } = editorView.state;
    const table = findTable(selection);
    if (!table) {
      return false;
    }
    return (
      isTableSelected(selection) ||
      (hoveredRows &&
        hoveredRows.length === TableMap.get(table.node).height &&
        !isResizing)
    );
  };

  private clearHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    clearHoverSelection()(state, dispatch);
  };

  private selectTable = () => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectTable(state.tr).setMeta('addToHistory', false));
  };

  private hoverTable = () => {
    const { state, dispatch } = this.props.editorView;
    hoverTable()(state, dispatch);
  };
}

export const CornerControls = injectIntl(CornerControlComponent);
