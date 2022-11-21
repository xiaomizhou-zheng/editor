/** @jsx jsx */

import { FC, MouseEventHandler } from 'react';

import { css, jsx } from '@emotion/react';

import { B50, N30A } from '@atlaskit/theme/colors';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gridSize = getGridSize();

const iconButtonStyles = css({
  display: 'flex',
  width: 5 * gridSize,
  height: 5 * gridSize,
  // TODO Delete this comment after verifying spacing token -> previous value `2 * gridSize`
  marginBottom: token('spacing.scale.200', '16px'),
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  padding: token('spacing.scale.0', '0px'),
  alignItems: 'center',
  justifyContent: 'center',
  background: 0,
  border: 0,
  borderRadius: '50%',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: 'inherit',
  lineHeight: 1,
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N30A),
  },
  '&:active': {
    backgroundColor: token('color.background.neutral.subtle.pressed', B50),
    outline: 0,
  },
});

interface IconButtonProps {
  testId?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: FC<IconButtonProps> = ({ children, onClick, testId }) => (
  <button
    type="button"
    css={iconButtonStyles}
    onClick={onClick}
    data-testid={testId}
  >
    {children}
  </button>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default IconButton;
