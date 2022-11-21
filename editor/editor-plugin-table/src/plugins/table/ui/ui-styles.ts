import { css } from '@emotion/react';
import {
  tableCellBorderWidth,
  tableMarginBottom,
  tableMarginTop,
} from '@atlaskit/editor-common/styles';
import {
  akEditorShadowZIndex,
  akEditorTableNumberColumnWidth,
  akEditorUnitZIndex,
} from '@atlaskit/editor-shared-styles';
import {
  N40A,
  B300,
  N300,
  R300,
  N20A,
  N60A,
  N0,
  Y50,
  Y200,
} from '@atlaskit/theme/colors';
import {
  tableToolbarColor,
  tableBorderColor,
  tableToolbarSelectedColor,
  tableBorderSelectedColor,
  tableCellDeleteColor,
  tableBorderDeleteColor,
  tableToolbarDeleteColor,
  lineMarkerOffsetFromColumnControls,
  lineMarkerSize,
  columnControlsDecorationHeight,
  columnControlsZIndex,
  columnControlsSelectedZIndex,
  resizeHandlerAreaWidth,
  resizeLineWidth,
  resizeHandlerZIndex,
  tableToolbarSize,
  tableInsertColumnButtonSize,
  tableDeleteButtonSize,
  tableControlsSpacing,
} from './consts';

import { TableCssClassName as ClassName } from '../types';
import { borderRadius } from '@atlaskit/theme/constants';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const InsertLine = (cssString?: string) => css`
  .${ClassName.CONTROLS_INSERT_LINE} {
    background: ${tableBorderSelectedColor};
    display: none;
    position: absolute;
    z-index: ${akEditorUnitZIndex};
    ${cssString}
  }
`;

const Marker = (props: ThemeProps) => css`
  background-color: ${tableBorderColor(props)};
  position: absolute;
  height: ${lineMarkerSize}px;
  width: ${lineMarkerSize}px;
  border-radius: 50%;
  pointer-events: none;
`;

export const InsertMarker = (props: ThemeProps, cssString?: string) => css`
  .${ClassName.CONTROLS_INSERT_MARKER} {
    ${Marker(props)};
    ${cssString}
  }
`;

const Button = (cssString?: string) => css`
  border-radius: ${borderRadius()}px;
  border-width: 0px;
  display: inline-flex;
  max-width: 100%;
  text-align: center;
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  transition: background 0.1s ease-out 0s,
    box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
  outline: none !important;
  cursor: none;

  > .${ClassName.CONTROLS_BUTTON_ICON} {
    display: inline-flex;
    max-height: 100%;
    max-width: 100%;
  }
  ${cssString}
`;

export const HeaderButton = (props: ThemeProps, cssString?: string) => css`
  .${ClassName.CONTROLS_BUTTON} {
    background: ${tableToolbarColor(props)};
    border: 1px solid ${tableBorderColor(props)};
    display: block;
    box-sizing: border-box;
    padding: 0;

    :focus {
      outline: none;
    }
    ${cssString}
  }

  .${ClassName.ROW_CONTROLS_BUTTON}::after {
    content: ' ';
    background-color: transparent;
    left: -15px;
    top: 0;
    position: absolute;
    width: 15px;
    height: 100%;
    z-index: 1;
  }

  .active .${ClassName.CONTROLS_BUTTON} {
    color: ${token('color.icon.inverse', N0)};
    background-color: ${tableToolbarSelectedColor};
    border-color: ${tableBorderSelectedColor};
  }
`;

export const HeaderButtonHover = () => css`
  .${ClassName.CONTROLS_BUTTON}:hover {
    color: ${token('color.icon.inverse', N0)};
    background-color: ${tableToolbarSelectedColor};
    border-color: ${tableBorderSelectedColor};
    cursor: pointer;
  }
`;

export const HeaderButtonDanger = () => css`
  .${ClassName.HOVERED_CELL_IN_DANGER} .${ClassName.CONTROLS_BUTTON} {
    background-color: ${tableToolbarDeleteColor};
    border-color: ${tableBorderDeleteColor};
    position: relative;
    z-index: ${akEditorUnitZIndex};
  }
`;

const InsertButton = () => css`
  .${ClassName.CONTROLS_INSERT_BUTTON_INNER} {
    position: absolute;
    z-index: ${akEditorUnitZIndex + 10};
    bottom: 0;
  }
  .${ClassName.CONTROLS_INSERT_BUTTON_INNER},
    .${ClassName.CONTROLS_INSERT_BUTTON} {
    height: ${tableInsertColumnButtonSize}px;
    width: ${tableInsertColumnButtonSize}px;
  }
  .${ClassName.CONTROLS_INSERT_BUTTON} {
    ${Button(`
      background: ${token('elevation.surface.overlay', 'white')};
      box-shadow: ${token(
        'elevation.shadow.overlay',
        `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`,
      )};
      color: ${token('color.icon', N300)};
    `)}
  }
  .${ClassName.CONTROLS_INSERT_LINE} {
    display: none;
  }
  &:hover .${ClassName.CONTROLS_INSERT_LINE} {
    display: flex;
  }
`;

const InsertButtonHover = () => css`
  .${ClassName.CONTROLS_INSERT_BUTTON}:hover {
    background: ${token('color.background.brand.bold', B300)};
    color: ${token('color.icon.inverse', 'white')};
    cursor: pointer;
  }
`;

export const insertColumnButtonWrapper = css`
  ${InsertButton()}
  ${InsertButtonHover()}
  ${InsertLine(`
    width: 2px;
    left: 9px;
  `)}
`;

export const insertRowButtonWrapper = css`
  ${InsertButton()}
  ${InsertButtonHover()}
  ${InsertLine(`
    height: 2px;
    top: -11px;
    left: ${tableInsertColumnButtonSize - 1}px;
  `)}
`;

export const columnControlsLineMarker = (props: ThemeProps) => css`
  .${ClassName.TABLE_CONTAINER}.${ClassName.WITH_CONTROLS}
    table
    tr:first-of-type
    td,
  .${ClassName.TABLE_CONTAINER}.${ClassName.WITH_CONTROLS}
    table
    tr:first-of-type
    th {
    position: relative;

    &::before {
      content: ' ';
      ${Marker(props)};
      top: -${tableToolbarSize + lineMarkerOffsetFromColumnControls}px;
      right: -${lineMarkerSize / 2}px;
    }
  }
`;

export const DeleteButton = css`
  .${ClassName.CONTROLS_DELETE_BUTTON_WRAP},
    .${ClassName.CONTROLS_DELETE_BUTTON} {
    height: ${tableDeleteButtonSize}px;
    width: ${tableDeleteButtonSize}px;
  }
  .${ClassName.CONTROLS_DELETE_BUTTON_WRAP} {
    .${ClassName.CONTROLS_DELETE_BUTTON} {
      ${Button(`
        background: ${token('color.background.neutral', N20A)};
        color: ${token('color.icon', N300)};
      `)}
    }
  }

  .${ClassName.CONTROLS_DELETE_BUTTON}:hover {
    background: ${token('color.background.danger.bold', R300)};
    color: ${token('color.icon.inverse', 'white')};
    cursor: pointer;
  }
`;

// TODO: https://product-fabric.atlassian.net/browse/DSP-4451
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const OverflowShadow = (props: ThemeProps) => css`
  .${ClassName.TABLE_RIGHT_SHADOW}, .${ClassName.TABLE_LEFT_SHADOW} {
    display: block;
    height: calc(
      100% - ${tableMarginTop + tableMarginBottom + tableToolbarSize - 2}px
    );
    position: absolute;
    pointer-events: none;
    top: ${tableMarginTop + tableToolbarSize - 1}px;
    z-index: ${akEditorShadowZIndex};
    width: 8px;
  }
  .${ClassName.TABLE_LEFT_SHADOW} {
    background: linear-gradient(to left, rgba(99, 114, 130, 0) 0, ${N40A} 100%);
    left: 0px;
  }
  .${ClassName.TABLE_CONTAINER}[data-number-column='true'] > :not(.${ClassName.TABLE_STICKY_SHADOW}).${ClassName.TABLE_LEFT_SHADOW} {
    left: ${akEditorTableNumberColumnWidth - 1}px;
  }
  .${ClassName.TABLE_RIGHT_SHADOW} {
    background: linear-gradient(
      to right,
      rgba(99, 114, 130, 0) 0,
      ${N40A} 100%
    );
    left: calc(100% + 2px);
  }
  .${ClassName.WITH_CONTROLS} {
    .${ClassName.TABLE_RIGHT_SHADOW}, .${ClassName.TABLE_LEFT_SHADOW} {
      height: calc(100% - ${tableMarginTop + tableMarginBottom - 2}px);
      top: ${tableMarginTop - 1}px;
    }
    .${ClassName.TABLE_LEFT_SHADOW} {
      border-left: 1px solid ${tableBorderColor(props)};
    }
  }
  .${ClassName.WITH_CONTROLS}.${ClassName.TABLE_STICKY} {
    .${ClassName.TABLE_RIGHT_SHADOW}, .${ClassName.TABLE_LEFT_SHADOW} {
      top: ${tableControlsSpacing}px;
    }
  }
`;
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

const columnHeaderButton = (props: ThemeProps, cssString?: string) => css`
  background: ${tableToolbarColor(props)};
  border: 1px solid ${tableBorderColor(props)};
  display: block;
  box-sizing: border-box;
  padding: 0;

  :focus {
    outline: none;
  }

  ${cssString}
`;

const columnHeaderButtonSelected = css`
  color: ${token('color.text.inverse', N0)};
  background-color: ${tableToolbarSelectedColor};
  border-color: ${tableBorderSelectedColor};
  z-index: ${columnControlsSelectedZIndex};
`;

export const columnControlsDecoration = (props: ThemeProps) => css`
  .${ClassName.COLUMN_CONTROLS_DECORATIONS} {
    display: none;
    cursor: pointer;
    position: absolute;
    width: calc(100% + ${tableCellBorderWidth * 2}px);
    left: -1px;
    top: -${columnControlsDecorationHeight + tableCellBorderWidth}px;
    height: ${columnControlsDecorationHeight}px;

    &::after {
      content: ' ';

      ${columnHeaderButton(
        props,
        `
        border-right: ${tableCellBorderWidth}px solid ${tableBorderColor(
          props,
        )};
        border-bottom: none;
        height: ${tableToolbarSize}px;
        width: 100%;
        position: absolute;
        top: ${columnControlsDecorationHeight - tableToolbarSize}px;
        left: 0px;
        z-index: ${columnControlsZIndex};
      `,
      )}
    }
  }

  .${ClassName.WITH_CONTROLS} .${ClassName.COLUMN_CONTROLS_DECORATIONS} {
    display: block;
  }

  table
    tr:first-of-type
    td.${ClassName.TABLE_CELL},
    table
    tr:first-of-type
    th.${ClassName.TABLE_HEADER_CELL} {
    &.${ClassName.COLUMN_SELECTED},
      &.${ClassName.HOVERED_COLUMN},
      &.${ClassName.HOVERED_TABLE} {
      .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
        ${columnHeaderButtonSelected};
      }

      &.${ClassName.HOVERED_CELL_IN_DANGER}
        .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
        background-color: ${tableToolbarDeleteColor};
        border: 1px solid ${tableBorderDeleteColor};
        border-bottom: none;
        z-index: ${akEditorUnitZIndex * 100};
      }
    }
  }

  .${ClassName.TABLE_SELECTED}
    table
    tr:first-of-type
    td.${ClassName.TABLE_CELL},
    .${ClassName.TABLE_SELECTED}
    table
    tr:first-of-type
    th.${ClassName.TABLE_HEADER_CELL} {
    .${ClassName.COLUMN_CONTROLS_DECORATIONS}::after {
      ${columnHeaderButtonSelected};
    }
  }
`;

export const hoveredDeleteButton = css`
  .${ClassName.TABLE_CONTAINER}.${ClassName.HOVERED_DELETE_BUTTON} {
    .${ClassName.SELECTED_CELL},
      .${ClassName.COLUMN_SELECTED},
      .${ClassName.HOVERED_CELL} {
      border: 1px solid ${tableBorderDeleteColor};
    }
    .${ClassName.SELECTED_CELL}::after {
      background: ${tableCellDeleteColor};
    }
  }
`;

export const hoveredCell = css`
  :not(.${ClassName.IS_RESIZING})
    .${ClassName.TABLE_CONTAINER}:not(.${ClassName.HOVERED_DELETE_BUTTON}) {
    .${ClassName.HOVERED_CELL} {
      position: relative;
      border: 1px solid ${tableBorderSelectedColor};
    }
  }
`;

export const hoveredWarningCell = css`
  :not(.${ClassName.IS_RESIZING})
    .${ClassName.TABLE_CONTAINER}:not(.${ClassName.HOVERED_DELETE_BUTTON}) {
    td.${ClassName.HOVERED_CELL_WARNING} {
      background-color: ${token(
        'color.background.warning',
        Y50,
      )} !important; // We need to override the background-color added to the cell
      border: 1px solid ${token('color.border.warning', Y200)};
    }
  }
`;

export const resizeHandle = css`
  .${ClassName.TABLE_CONTAINER} {
    .${ClassName.RESIZE_HANDLE_DECORATION} {
      background-color: transparent;
      position: absolute;
      width: ${resizeHandlerAreaWidth}px;
      height: 100%;
      top: 0;
      right: -${resizeHandlerAreaWidth / 2}px;
      cursor: col-resize;
      z-index: ${resizeHandlerZIndex};
    }

    td.${ClassName.WITH_RESIZE_LINE}, th.${ClassName.WITH_RESIZE_LINE} {
      .${ClassName.RESIZE_HANDLE_DECORATION}::after {
        content: ' ';
        right: ${(resizeHandlerAreaWidth - resizeLineWidth) / 2}px;
        position: absolute;
        width: ${resizeLineWidth}px;
        height: calc(100% + 1px);
        background-color: ${tableBorderSelectedColor};
        z-index: ${columnControlsZIndex * 2};
        top: 0;
      }
    }

    table
      tr:first-of-type
      th.${ClassName.WITH_RESIZE_LINE}
      .${ClassName.RESIZE_HANDLE_DECORATION}::after,
      table
      tr:first-of-type
      td.${ClassName.WITH_RESIZE_LINE}
      .${ClassName.RESIZE_HANDLE_DECORATION}::after {
      top: -${tableToolbarSize + tableCellBorderWidth}px;
      height: calc(100% + ${tableToolbarSize + tableCellBorderWidth}px);
    }
  }
`;
