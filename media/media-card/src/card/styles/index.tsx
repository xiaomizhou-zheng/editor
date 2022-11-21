import { css } from '@emotion/react';

import { fontFamily } from '@atlaskit/theme/constants';
import { fadeIn } from '@atlaskit/media-ui';

export { defaultTransitionDuration } from './config';
export {
  antialiased,
  borderRadiusLeft,
  capitalize,
  centerSelf,
  centerSelfX,
  centerSelfY,
  centerX,
  hexToRgb,
  rgba,
  spaceAround,
  transition,
  withAppearance,
} from './mixins';
export type { WithAppearanceProps } from './mixins';
export { easeOutCubic, easeOutExpo } from './easing';
export { spin } from './animations';

export const rootStyles = () => css`
  box-sizing: border-box;
  font-family: ${fontFamily()};

  * {
    box-sizing: border-box;
  }
`;

export const cardShadow = `
  box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);
`;

export const fadeinImageStyles = () => css`
  ${fadeIn};
`;

export default rootStyles;
