/** @jsx jsx */
import { FC } from 'react';

import { jsx } from '@emotion/react';

import {
  cellStyles,
  fixedSizeTruncateStyles,
  getTruncationStyleVars,
  overflowTruncateStyles,
  TruncateStyleProps,
  truncationWidthStyles,
} from './constants';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const TableBodyCell: FC<TruncateStyleProps> = ({
  width,
  isFixedSize,
  shouldTruncate,
  innerRef,
  ...props
}) => (
  <td
    style={getTruncationStyleVars({ width }) as React.CSSProperties}
    css={[
      truncationWidthStyles,
      isFixedSize && shouldTruncate && fixedSizeTruncateStyles,
      isFixedSize && overflowTruncateStyles,
      cellStyles,
    ]}
    // HOC withDimensions complains about the types but it is working fine
    // @ts-ignore
    ref={innerRef}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
  />
);
