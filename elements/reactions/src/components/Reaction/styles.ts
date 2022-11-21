/** @jsx jsx */
import { css } from '@emotion/react';
import { B50, B75, B300, N20, N40, N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/**
 * Default styling px height for an emoji reaction
 */
const akHeight = 24;

/**
 * Styling Note:
 * Padding and line height are set within the child components
 * of FlashAnimation b/c it otherwise throws off the flash styling
 */

export const emojiStyle = css({
  transformOrigin: 'center center 0',
  lineHeight: '12px',
  padding: '4px 4px 4px 8px',
});

export const reactionStyle = css({
  outline: 'none',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  minWidth: '36px',
  height: `${akHeight}px`,
  background: 'transparent',
  border: `1px solid ${token('color.border', N40)}`,
  boxSizing: 'border-box',
  borderRadius: '20px',
  color: `${token('color.text.subtle', N400)}`,
  cursor: 'pointer',
  margin: 0,
  padding: 0,
  transition: '200ms ease-in-out',
  '&:hover': {
    background: `${token('color.background.neutral.subtle.hovered', N20)}`,
  },
});

export const reactedStyle = css({
  backgroundColor: token('color.background.selected', B50),
  borderColor: token('color.border.selected', B300),
  '&:hover': {
    background: `${token('color.background.selected.hovered', B75)}`,
  },
});

export const flashHeight = akHeight - 2; // height without the 1px border

export const flashStyle = css({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '10px',
  height: `${flashHeight}px`,
});
