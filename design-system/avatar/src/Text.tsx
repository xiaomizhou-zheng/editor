/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { FC, ReactNode } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';

import { N200, N900 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const getStyles = (
  isSecondary: boolean | undefined,
  shouldTruncate: boolean,
): SerializedStyles =>
  css({
    display: 'block',
    // TODO Delete this comment after verifying spacing token -> previous value `0`
    margin: token('spacing.scale.0', '0px'),
    color: token('color.text', N900),

    ...(shouldTruncate && {
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),

    ...(isSecondary && {
      color: token('color.text.subtlest', N200),
      fontSize: '0.85em',
    }),
  });

/**
 * __Text__
 *
 * Text is used internally only.
 */
const Text: FC<{
  isSecondary?: boolean;
  children: ReactNode;
  shouldTruncate: boolean;
}> = ({ isSecondary, children, shouldTruncate }) => (
  // TODO: Refactor styles to follow css prop rules
  // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
  <span css={getStyles(isSecondary, shouldTruncate)}>{children}</span>
);

export default Text;
