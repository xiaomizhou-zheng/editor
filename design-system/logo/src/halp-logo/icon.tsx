/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({
  appearance,
  iconGradientStart,
  iconGradientStop,
  iconColor,
}: LogoProps) => {
  let colors = {
    iconGradientStart,
    iconGradientStop,
    iconColor,
  };
  // Will be fixed upon removal of deprecated iconGradientStart and
  // iconGradientStop props, or with React 18's useId() hook when we update.
  // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
  let id = uid({ iconGradientStart: iconGradientStop });

  if (appearance) {
    colors = getColorsFromAppearance(appearance);
    id = `halpIcon-${appearance}`;
  }

  return `
  <svg
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
  <radialGradient id="${id}" cx="0" cy="0" gradientTransform="matrix(9.99792 0 0 10.02 15.9984 16.0001)" gradientUnits="userSpaceOnUse" r="1">
  <stop stop-color="${colors.iconGradientStart}" ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0"/>
  <stop offset="1" stop-color="${colors.iconGradientStop}"/>
  </radialGradient>
  <g clip-rule="evenodd" fill-rule="evenodd">
    <path fill="url(#${id})" d="m23.072 8.91718c1.3975 1.40162 2.3491 3.18702 2.7343 5.13052s.1868 3.9578-.5701 5.7884c-.7569 1.8305-2.0383 3.395-3.6824 4.4957-1.644 1.1007-3.5767 1.6882-5.5538 1.6882s-3.9098-.5875-5.5539-1.6882c-1.64396-1.1007-2.92542-2.6652-3.68233-4.4957-.75692-1.8306-.9553-3.8449-.57007-5.7884s1.33677-3.7289 2.73433-5.13052c.92848-.93116 2.03097-1.66983 3.24437-2.1738 1.2135-.50397 2.5141-.76337 3.8276-.76337s2.6141.2594 3.8276.76337c1.2134.50397 2.3159 1.24264 3.2444 2.1738zm-12.4506 12.49372-.0281-.0282.0188.0188zm8.0546-9.638 1.8746-1.87877c-1.3177-.98501-2.9176-1.51713-4.5615-1.51713s-3.2439.53212-4.5616 1.51713l1.8746 1.87877-1.5372 1.5406-1.87457-1.8788c-.98401 1.3196-1.51571 2.9227-1.51571 4.5701 0 1.6473.5317 3.2505 1.51571 4.57l1.87457-1.8787 1.5372 1.5468-1.8746 1.8788c1.3177.985 2.9177 1.5171 4.5616 1.5171s3.2438-.5321 4.5615-1.5171l-1.8746-1.8788 1.5372-1.5468 1.8746 1.8787c.984-1.3195 1.5157-2.9227 1.5157-4.57 0-1.6474-.5317-3.2505-1.5157-4.5701l-1.8746 1.8788z"/>
    <path fill="${
      colors.iconColor
    }" d="m15.9984 10.9901c-.9887 0-1.9552.2938-2.7772.8443-.8221.5505-1.4628 1.3329-1.8412 2.2484s-.4773 1.9228-.2845 2.8947c.1929.9718.669 1.8645 1.3681 2.5652.6992.7006 1.5899 1.1778 2.5596 1.3711s1.9748.0941 2.8883-.2851c.9134-.3792 1.6941-1.0214 2.2434-1.8452.5493-.8239.8425-1.7926.8425-2.7834 0-1.3288-.5267-2.6031-1.4642-3.5427-.9374-.9395-2.209-1.4673-3.5348-1.4673zm0 7.8281c-.5561 0-1.0998-.1653-1.5622-.475-.4624-.3096-.8228-.7498-1.0356-1.2647-.2129-.5149-.2685-1.0816-.16-1.6282.1085-.5467.3763-1.0488.7695-1.443.3933-.3941.8943-.6625 1.4398-.7712.5454-.1088 1.1108-.053 1.6246.1603s.953.5745 1.262 1.038c.3089.4634.4739 1.0083.4739 1.5657.0004.3703-.0721.7371-.2132 1.0794-.1411.3422-.3482.6533-.6093.9153-.2612.262-.5713.4699-.9127.6117-.3413.1418-.7072.2148-1.0768.2148z"/>
  </g>
  </svg>`;
};

/**
 * __Halp icon__
 *
 * The Halp icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const HalpIcon = ({
  appearance,
  label = 'Halp',
  size = defaultLogoParams.size,
  testId,
  textColor = defaultLogoParams.textColor,
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
}: LogoProps) => {
  return (
    <Wrapper
      appearance={appearance}
      label={label}
      svg={svg({
        appearance,
        iconGradientStart,
        iconGradientStop,
        iconColor,
      })}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      testId={testId}
      textColor={textColor}
    />
  );
};
