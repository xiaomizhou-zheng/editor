import { css } from '@emotion/react';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { typography } from '@atlaskit/theme';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const gridSize = getGridSize();

export const listContainerStyles = css`
  padding-top: 0;
  min-height: 80px;
  margin-top: ${gridSize * 2}px;
  margin-bottom: ${gridSize * 2}px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const spinnerContainerStyles = css`
  text-align: center;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

export const listStyles = css`
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const listTitleStyles = css`
  ${typography.h100()}
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: ${gridSize / 2}px;
`;
