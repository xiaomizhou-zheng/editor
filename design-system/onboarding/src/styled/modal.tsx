/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { useGlobalTheme } from '@atlaskit/theme/components';
import { borderRadius as getBorderRadius } from '@atlaskit/theme/constants';
import { h600 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const borderRadius = getBorderRadius();

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH600Styles = css(h600({ theme: { mode: 'light' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH600Styles = css(h600({ theme: { mode: 'dark' } }));

const modalBodyStyles = css({
  padding: `${token('spacing.scale.500', '40px')} ${token(
    'spacing.scale.250',
    '20px',
  )}`,
  textAlign: 'center',
});

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const modalHeadingStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value ``${gridSize}px``
  marginBottom: token('spacing.scale.100', '8px'),
  color: 'inherit',
});

const modalImageStyles = css({
  width: '100%',
  height: 'auto',
  borderTopLeftRadius: `${borderRadius}px`,
  borderTopRightRadius: `${borderRadius}px`,
  '@media (min-width: 320px) and (max-width: 480px)': {
    borderRadius: 0,
  },
});

const modalActionContainerStyles = css({
  display: 'flex',
  padding: `${token('spacing.scale.0', '0px')} ${token(
    'spacing.scale.500',
    '40px',
  )} 36px`,
  justifyContent: 'center',
  flexDirection: 'row',
  flexFlow: 'wrap',
});

const modalActionContainerReversedStyles = css({
  flexDirection: 'row-reverse',
});

const modalActionItemStyles = css({
  margin: `${token('spacing.scale.0', '0px')} ${token(
    'spacing.scale.050',
    '4px',
  )} ${token('spacing.scale.050', '4px')}`,
});

/**
 * __Modal body__
 *
 * @internal
 */
export const ModalBody: React.FC<{}> = ({ children }) => (
  <div css={modalBodyStyles}>{children}</div>
);

/**
 * __Modal heading__
 *
 * @internal
 */
export const ModalHeading: React.FC<{}> = ({ children }) => {
  const { mode } = useGlobalTheme();
  return (
    <h4
      css={[
        mode === 'light' ? lightH600Styles : darkH600Styles,
        modalHeadingStyles,
      ]}
    >
      {children}
    </h4>
  );
};

/**
 * __Modal image__
 *
 * @internal
 */
export const ModalImage: React.FC<{ alt: string; src?: string }> = ({
  alt,
  src,
}) => <img css={modalImageStyles} alt={alt} src={src} />;

/**
 * __Modal action container__
 *
 * @internal
 */
export const ModalActionContainer: React.FC<{
  shouldReverseButtonOrder: boolean;
}> = ({ children, shouldReverseButtonOrder }) => (
  <div
    css={[
      modalActionContainerStyles,
      shouldReverseButtonOrder && modalActionContainerReversedStyles,
    ]}
  >
    {children}
  </div>
);

/**
 * __Modal action item__
 *
 * @internal
 */
export const ModalActionItem: React.FC<{}> = ({ children }) => (
  <div css={modalActionItemStyles}>{children}</div>
);
