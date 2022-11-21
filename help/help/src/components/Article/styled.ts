/** @jsx jsx */

import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const ArticleContainer = styled.div`
  padding: ${gridSize() * 2}px ${gridSize() * 3}px;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: ${token('elevation.surface', '#FFFFFF')};
  left: 100%;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 2;
`;
