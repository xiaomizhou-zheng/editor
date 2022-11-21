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
  textColor,
}: LogoProps) => {
  let colors = {
    iconGradientStart,
    iconGradientStop,
    iconColor,
    textColor,
  };
  // Will be fixed upon removal of deprecated iconGradientStart and
  // iconGradientStop props, or with React 18's useId() hook when we update.
  // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
  let id = uid({ iconGradientStart: iconGradientStop });

  if (appearance) {
    colors = getColorsFromAppearance(appearance);
    id = `halpLogo-${appearance}`;
  }

  return `
    <svg
      fill="none"
      height="32"
      viewBox="0 0 83 32"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
    <radialGradient
      id="${id}"
      cx="0"
      cy="0"
      gradientTransform="matrix(9.99792 0 0 10.02 9.99636 14.7546)"
      gradientUnits="userSpaceOnUse"
      r="1"
      >
     <stop stop-color="${colors.iconGradientStart}" ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0"/>
      <stop offset="1" stop-color="${colors.iconGradientStop}"/>
      </radialGradient>
        <g
          clip-rule="evenodd"
          fill-rule="evenodd"
        >
        <path
          d="m66.9971 23.9197c-2.2527 0-3.6836-1.0771-3.6836-3.6103v-16.01008h2.3651v15.73458c0 1.2525.8248 1.6814 1.8434 1.6814.2295.0042.459-.0052.6873-.0281v2.1198c-.3979.0875-.805.1254-1.2122.1127zm-22.9014-.0845v-18.10177h-2.4745v7.90637h-9.5137v-7.90637h-2.4744v18.10177h2.4744v-7.8281h9.5137v7.8281zm8.6324.2755c2.1183 0 3.768-.9362 4.6459-2.7555l.0031 2.48h2.3652v-13.7775h-2.3652v2.4267c-.8279-1.7911-2.3651-2.70226-4.3741-2.70226-3.8492 0-5.7738 3.28156-5.7738 7.16426 0 4.0519 1.8434 7.1643 5.4989 7.1643zm4.6459-6.6132c0 3.0593-1.8965 4.4088-4.0117 4.4088-2.4494 0-3.7804-1.6533-3.7804-4.9599 0-3.1938 1.3747-4.9599 4.0429-4.9599 2.0183 0 3.7492 1.3527 3.7492 4.4088zm15.4811 11.7109v-7.7968c.8248 1.7911 2.362 2.6991 4.371 2.6991 3.8492 0 5.7738-3.2784 5.7738-7.1643 0-4.033-1.8434-7.16426-5.4989-7.16426-2.1183 0-3.7679.93936-4.6459 2.75546v-2.4799h-2.3651v19.1507zm0-12.8131c0-3.0561 1.8965-4.4088 4.0117-4.4088 2.4495 0 3.7679 1.6533 3.7804 4.9599 0 3.197-1.3747 4.9599-4.0429 4.9599-2.0183 0-3.7492-1.3495-3.7492-4.4088z"
          fill="${colors.textColor}"
        />
        <path
          d="m17.0699 7.67166c1.3976 1.40159 2.3491 3.18704 2.7343 5.13054.3853 1.9435.1869 3.9578-.57 5.7883-.757 1.8306-2.0384 3.3951-3.6824 4.4958s-3.5768 1.6882-5.55388 1.6882c-1.97711 0-3.90984-.5875-5.55385-1.6882-1.644-1.1007-2.92546-2.6652-3.682378-4.4958-.75691561-1.8305-.955299-3.8448-.57007-5.7883.385228-1.9435 1.336768-3.72895 2.734338-5.13054.92848-.93115 2.03094-1.66982 3.24438-2.17379 1.21344-.50398 2.51407-.76337 3.82758-.76337 1.31348 0 2.61418.25939 3.82758.76337 1.2134.50397 2.3159 1.24264 3.2444 2.17379zm-12.45054 12.49374-.02812-.0282.01874.0188zm8.05454-9.638 1.8746-1.87879c-1.3177-.985-2.9176-1.51712-4.56151-1.51712-1.64389 0-3.24382.53212-4.56155 1.51712l1.87461 1.87879-1.53718 1.5405-1.87461-1.8787c-.98401 1.3195-1.51572 2.9227-1.51572 4.5701 0 1.6473.53171 3.2505 1.51572 4.57l1.87461-1.8787 1.53718 1.5468-1.87461 1.8788c1.31773.985 2.91766 1.5171 4.56155 1.5171 1.64391 0 3.24381-.5321 4.56151-1.5171l-1.8746-1.8788 1.5372-1.5468 1.8746 1.8787c.984-1.3195 1.5157-2.9227 1.5157-4.57 0-1.6474-.5317-3.2506-1.5157-4.5701l-1.8746 1.8787z"
          fill="url(#${id})"
          />
          <path d="m9.99628 9.74454c-.9887 0-1.9552.29386-2.77728.84436-.82207.5505-1.4628 1.3329-1.84116 2.2484s-.47736 1.9228-.28447 2.8946c.19289.9719.66899 1.8646 1.36811 2.5652.69912.7007 1.58984 1.1779 2.55955 1.3712.9697.1933 1.97487.0941 2.88827-.2851s1.6942-1.0214 2.2435-1.8453c.5493-.8238.8424-1.7925.8424-2.7834 0-1.3287-.5266-2.603-1.4641-3.5426-.9375-.9395-2.209-1.46736-3.53482-1.46736zm0 7.82816c-.55615 0-1.0998-.1653-1.56222-.475-.46242-.3096-.82283-.7498-1.03565-1.2647-.21283-.515-.26852-1.0816-.16002-1.6283.1085-.5466.37631-1.0488.76956-1.4429.39326-.3941.89429-.6625 1.43975-.7712.54546-.1088 1.1108-.053 1.6247.1603.5138.2133.9529.5745 1.2619 1.038.309.4634.4739 1.0083.4739 1.5656.0004.3704-.072.7372-.2132 1.0794-.1411.3423-.3481.6534-.6093.9154-.2611.262-.5713.4699-.9126.6117-.3414.1418-.7073.2148-1.07682.2148z"
          fill="${colors.iconColor}"
        />
        </g>
      </svg>
    `;
};

/**
 * __Halp logo__
 *
 * The Halp logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const HalpLogo = ({
  appearance,
  label = 'Halp',
  size = defaultLogoParams.size,
  testId,
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
  textColor = defaultLogoParams.textColor,
}: LogoProps) => {
  return (
    <Wrapper
      appearance={appearance}
      label={label}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      svg={svg({
        appearance,
        iconGradientStart,
        iconGradientStop,
        iconColor,
        textColor,
      })}
      testId={testId}
      textColor={textColor}
    />
  );
};
