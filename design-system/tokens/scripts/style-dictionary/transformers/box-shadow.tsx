import padStart from 'lodash/padStart';
import type { Transform } from 'style-dictionary';

import type { ShadowToken } from '../../../src/types';

function isHex(hex: string) {
  return /[0-9A-Fa-f]{6}/g.test(hex);
}

const percentToHex = (percent: number): string => {
  const normalizedPercent = percent * 100;
  const intValue = Math.round((normalizedPercent / 100) * 255); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString(16); // get hexadecimal representation
  return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
};

// If opacity is 1 don't bother setting a hex.
const shadowOpacity = (opacity: number): string => {
  return opacity === 1
    ? ''
    : padStart(percentToHex(opacity).toUpperCase(), 2, '0');
};

const paletteValue = (palette: object, color: string): string => {
  // elevation.shadow.overflow doesn't use a palette colour at the moment
  if (isHex(color)) {
    return color;
  }

  // Ensure we only pick the color not the alpha (get the first 6 characters).
  // @ts-expect-error
  return palette.color.palette[color].value.slice(0, 7);
};

const transform = (palette: Record<string, any>): Transform => ({
  type: 'value',
  matcher: (token) => !!token.attributes && token.attributes.group === 'shadow',
  transformer: (token) => {
    const shadowToken = token.original as ShadowToken<any>;

    return shadowToken.value
      .splice(0)
      .map((shadow) => {
        // We don't use the opacity from the color value, but the opacity
        // defined in the token declaration.
        const opacityHex = shadowOpacity(shadow.opacity);
        const paletteColor = paletteValue(palette, shadow.color);
        const shadowColor = `${paletteColor}${opacityHex}`;
        const optionalSpread = shadow.spread ? ` ${shadow.spread}px` : '';
        const optionalInset = shadow.inset ? 'inset ' : '';

        return `${optionalInset}${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius}px${optionalSpread} ${shadowColor}`;
      })
      .join(', ');
  },
});

export default transform;
