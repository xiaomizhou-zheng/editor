/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const HEADER_TITLE_HEIGHT = gridSize() * 7;
const HEADER_TITLE_BORDER_BOTTOM = 2;

export const HeaderContainer = styled.div`
  background-color: ${token('color.background.neutral', colors.N10)};
  border-bottom: ${HEADER_TITLE_BORDER_BOTTOM}px solid
    ${token('color.border', colors.N30)};
  justify-content: space-between;
  position: relative;
`;

export const CloseButtonContainer = styled.div`
  position: absolute;
  right: ${gridSize()}px;
  top: ${gridSize() * 1.5}px;
`;

export const BackButtonContainer = styled.div`
  position: absolute;
  top: ${gridSize() * 1.5}px;
  left: ${gridSize()}px;
`;

export const HeaderTitle = styled.div`
  color: ${token('color.text.subtle', colors.N500)};
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: ${HEADER_TITLE_HEIGHT}px;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
`;

export const HeaderContent = styled.div`
  padding: 0 ${gridSize() * 2}px ${gridSize() * 2}px ${gridSize() * 2}px;
`;
