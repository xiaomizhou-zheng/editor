import { css } from '@emotion/react';

import {
  akEditorBlockquoteBorderColor,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const blockquoteSharedStyles = css`
  & blockquote {
    box-sizing: border-box;
    padding-left: ${gridSize() * 2}px;
    border-left: 2px solid
      ${token('color.border', akEditorBlockquoteBorderColor)};
    margin: ${blockNodesVerticalMargin} 0 0 0;
    margin-right: 0;

    [dir='rtl'] & {
      padding-left: 0;
      padding-right: ${gridSize() * 2}px;
    }

    &:first-child {
      margin-top: 0;
    }

    &::before {
      content: '';
    }

    &::after {
      content: none;
    }

    & p {
      display: block;
    }

    & table,
    & table:last-child {
      display: inline-table;
    }
  }
`;
