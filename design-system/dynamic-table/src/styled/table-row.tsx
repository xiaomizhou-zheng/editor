/** @jsx jsx */
import { CSSProperties, forwardRef, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { tableRowCSSVars as cssVars } from './dynamic-table';

export type ITableRowProps = {
  isHighlighted?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
};

const rowStyles = css({
  '&:focus': {
    outline: `2px solid ${token(
      'color.border.focused',
      `var(${cssVars.CSS_VAR_HOVER_BACKGROUND})`,
    )}`,
    outlineOffset: `-2px`,
  },
});

const rowBackgroundStyles = css({
  '&:hover': {
    backgroundColor: token(
      'color.background.neutral.subtle.hovered',
      `var(${cssVars.CSS_VAR_HOVER_BACKGROUND})`,
    ),
  },
});
const rowHighlightedBackgroundStyles = css({
  backgroundColor: token(
    'color.background.selected',
    `var(${cssVars.CSS_VAR_HIGHLIGHTED_BACKGROUND})`,
  ),
  '&:hover': {
    backgroundColor: token(
      'color.background.selected.hovered',
      `var(${cssVars.CSS_VAR_HOVER_HIGHLIGHTED_BACKGROUND})`,
    ),
  },
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const TableBodyRow = forwardRef<HTMLTableRowElement, ITableRowProps>(
  ({ isHighlighted, children, style, ...rest }, ref) => {
    return (
      <tr
        style={style}
        css={[
          rowStyles,
          isHighlighted ? rowHighlightedBackgroundStyles : rowBackgroundStyles,
        ]}
        {...rest}
        ref={ref}
      >
        {children}
      </tr>
    );
  },
);
