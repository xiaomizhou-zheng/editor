/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const imageStyles = css({
  maxWidth: '100%',
  height: 'auto',
});

const actionItemContainerStyles = css({
  display: 'flex',
  margin: `${token('spacing.scale.0', '0px')} -4px`,
  /* When there is more than one action, place primary action visually on the
  right, but keep it's position as the first focusable element in the DOM */
  flexDirection: 'row-reverse',
});

const actionItemStyles = css({
  margin: `${token('spacing.scale.0', '0px')} ${token(
    'spacing.scale.050',
    '4px',
  )}`,
});

/**
 * __Dialog image__
 *
 * An optional header image in spotlight dialogs.
 *
 * @internal
 */
export const DialogImage: React.FC<React.ImgHTMLAttributes<
  HTMLImageElement
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
>> = ({ alt, ...props }) => <img css={imageStyles} alt={alt} {...props} />;

/**
 * __Dialog action item container__
 *
 * Flex wrapper around dialog action items.
 *
 * @internal
 */
export const DialogActionItemContainer: React.FC<{}> = ({ children }) => (
  <div css={actionItemContainerStyles}>{children}</div>
);

/**
 * __Dialog action item__
 *
 * Action items shown inside of the dialog.
 *
 * @internal
 */
export const DialogActionItem: React.FC<{}> = ({ children }) => (
  <div css={actionItemStyles}>{children}</div>
);
