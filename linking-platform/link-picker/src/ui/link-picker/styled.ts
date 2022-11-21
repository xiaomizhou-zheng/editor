import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { N500 } from '@atlaskit/theme/colors';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const LINK_PICKER_WIDTH_IN_PX = 342;
const LINK_PICKER_MIN_HEIGHT_IN_PX = 220;

const gridSize = getGridSize();

/**
 * Half padding on the top as the form field has a `gridSize()` margin top that cannot be overridden
 */
export const rootContainerStyles = css`
  width: ${LINK_PICKER_WIDTH_IN_PX}px;
  padding: ${gridSize}px ${gridSize * 2}px ${gridSize * 2}px;
  box-sizing: border-box;
  line-height: initial;
  min-height: ${LINK_PICKER_MIN_HEIGHT_IN_PX}px;
`;

export const rootContainerStylesForLoader = css`
  ${rootContainerStyles}
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const searchIconStyles = css`
  margin-left: ${gridSize / 2}px;
  color: ${token('color.icon', N500)};
  cursor: default;
`;

export const tabsWrapperStyles = css`
  margin-top: ${gridSize * 1.5}px;
  margin-left: -${gridSize}px;
  margin-right: -${gridSize}px;
`;

export const flexColumnStyles = css`
  display: flex;
  flex-direction: column;
`;

export const formFooterMargin = css`
  margin-top: ${gridSize * 2}px;
`;
