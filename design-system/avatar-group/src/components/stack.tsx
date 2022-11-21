/** @jsx jsx */
import { Children, FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { BORDER_WIDTH } from '@atlaskit/avatar';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gutter = BORDER_WIDTH * 2 + gridSize() / 2;

const listStyles = css({
  display: 'flex',
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  margin: token('spacing.scale.0', '0px'),
  marginRight: gutter,
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  padding: token('spacing.scale.0', '0px'),
  lineHeight: 1,
  listStyleType: 'none !important',
});

const listItemStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  margin: token('spacing.scale.0', '0px'),
  marginRight: -gutter,
});

const Stack: FC<{
  children: ReactNode;
  testId?: string;
  'aria-label': string;
}> = ({ children, testId, 'aria-label': label }) => (
  <ul data-testid={testId} aria-label={label} css={listStyles}>
    {Children.map(
      children,
      (child) => child && <li css={listItemStyles}>{child}</li>,
    )}
  </ul>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Stack;
