/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import type { CustomGlyphProps } from '../../src/types';
import Icon from '../../src';
import { B500, Y500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const stylesStyles = css({
  backgroundColor: token('color.icon.warning', Y500),
});

const CustomGlyph = (props: CustomGlyphProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    data-testid={props['data-testid']}
    aria-label={props['aria-label']}
    className={props.className}
  >
    <path
      fill="currentColor"
      d="M24 12c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12C0 5.372 5.372 0 12 0c6.627 0 12 5.372 12 12zM12 2.92A9.08 9.08 0 002.92 12 9.08 9.08 0 0012 21.08 9.08 9.08 0 0021.081 12 9.08 9.08 0 0012 2.92zm0 16.722A7.64 7.64 0 014.36 12 7.64 7.64 0 0112 4.36 7.64 7.64 0 0119.641 12a7.64 7.64 0 01-7.64 7.641z"
    />
  </svg>
);

const CustomIconExample = () => {
  return (
    <div css={stylesStyles}>
      {/* primaryColor is explicitly set */}
      <Icon
        glyph={CustomGlyph}
        label=""
        secondaryColor={token('color.icon.brand', B500)}
      />
      {/* inherited from the color prop of the parent element */}
      <Icon glyph={CustomGlyph} label="" />
    </div>
  );
};

export default CustomIconExample;
