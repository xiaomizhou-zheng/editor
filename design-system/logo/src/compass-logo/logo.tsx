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
    id = `compassLogo-${appearance}`;
  }

  return `
  <svg
    fill="none"
    viewBox="0 0 138 32"
    height="32"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
  >
    <linearGradient
      id="${id}"
      gradientUnits="userSpaceOnUse"
      x1="14.8536"
      x2="5.87437"
      y1="8.27633"
      y2="17.2556"
    >
      <stop offset="20%" stop-color="${colors.iconGradientStart}" ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
      <stop offset="100%" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <path
      clip-rule="evenodd"
      d="m41.7694 22.8121c-1.1334.7473-2.9293 1.0769-4.8099 1.0769-5.9589 0-9.3183-3.5917-9.3183-9.3089 0-5.50994 3.3594-9.39361 9.2712-9.39361 1.7676 0 3.5352.31396 4.835 1.25584v2.40178c-1.2998-.82885-2.7346-1.25583-4.835-1.25583-4.2541 0-6.7972 2.82562-6.7972 6.99182 0 4.1663 2.6247 6.9354 6.9448 6.9354 1.6361.0146 3.2515-.3656 4.7094-1.1083zm2.2985-6.1318c0-4.1443 2.43-7.15827 6.5743-7.15827 4.1442 0 6.5115 3.00147 6.5115 7.15827s-2.405 7.221-6.521 7.221-6.5648-3.0799-6.5648-7.221zm2.3201 0c0 2.6247 1.2998 4.9982 4.2542 4.9982 2.9543 0 4.2007-2.3735 4.2007-4.9982s-1.2558-4.948-4.2007-4.948c-2.945 0-4.2542 2.3233-4.2542 4.948zm22.9026 6.9327h2.3766v-7.6794c0-2.7911 1.5321-4.2542 3.7298-4.2542 2.2637 0 3.2589 1.4097 3.2589 4.2542v7.6794h2.3767v-8.0939c0-3.8962-1.7142-5.99659-4.8067-5.99659-2.2919 0-4.1443 1.24329-4.9166 3.37189-.6907-2.182-2.295-3.37189-4.6434-3.37189-.891-.0185-1.7698.2091-2.5397.65779-.77.4487-1.4012 1.101-1.8244 1.8853v-2.2668h-2.3766v13.8142h2.3766v-7.6794c0-2.7911 1.5322-4.2542 3.7299-4.2542 2.2636 0 3.2589 1.1051 3.2589 3.5917zm18.0022-2.4305v7.8175h-2.3767v-19.20168h2.3767v2.48658c.8854-1.821 2.5431-2.76287 4.6686-2.76287 3.6733 0 5.5256 3.13957 5.5256 7.18337 0 3.8962-1.9339 7.1834-5.8019 7.1834-2.0313 0-3.5791-.9105-4.3923-2.7063zm4.0267-9.4502c-2.1474.0033-4.0267 1.36-4.0267 4.4205v1.1052c0 3.0674 1.7393 4.4205 3.7675 4.4205 2.6781 0 4.0595-1.7676 4.0595-4.9731-.0251-3.3118-1.3472-4.9695-3.8003-4.9731zm13.6115 12.1565c2.129 0 3.787-.9388 4.669-2.7629l.003 2.4866h2.377v-13.81418h-2.377v2.43318c-.832-1.7958-2.38-2.70947-4.395-2.70947-3.868 0-5.8022 3.29027-5.8022 7.18337 0 4.0626 1.8522 7.1834 5.5252 7.1834zm4.669-6.6308c0 3.0674-1.906 4.4205-4.034 4.4205-2.459 0-3.784-1.6577-3.793-4.9731 0-3.2024 1.381-4.9731 4.059-4.9731 2.029 0 3.768 1.3563 3.768 4.4205zm10.307 6.6313c-1.66.0436-3.306-.3004-4.81-1.0047v-2.5117c1.509.8373 3.196 1.3013 4.92 1.3532 1.824 0 2.763-.7472 2.763-1.8241s-.804-1.6577-3.426-2.2919c-3.067-.7472-4.367-1.934-4.367-4.2008 0-2.4018 1.853-3.86796 5.002-3.86796 1.54-.02192 3.064.31902 4.448.99526v2.4583c-1.657-.8289-3.01-1.2559-4.477-1.2559-1.739 0-2.678.606-2.678 1.6829 0 .967.663 1.5698 3.203 2.1977 3.067.7441 4.615 1.8837 4.615 4.2792 0 2.2511-1.491 3.9905-5.193 3.9905zm7.461-1.0047c1.506.7075 3.158 1.0516 4.822 1.0046 3.686 0 5.177-1.7393 5.177-3.9904 0-2.3955-1.548-3.5351-4.612-4.2792-2.543-.6279-3.205-1.2307-3.205-2.1977 0-1.0769.938-1.6829 2.678-1.6829 1.466 0 2.819.427 4.477 1.2559v-2.4583c-1.385-.67624-2.909-1.01718-4.449-.99526-3.149 0-5.001 1.46616-5.001 3.86796 0 2.2668 1.299 3.4536 4.367 4.2008 2.625.6342 3.425 1.215 3.425 2.2919s-.939 1.8241-2.763 1.8241c-1.723-.0518-3.409-.5158-4.916-1.3532z"
      fill="${colors.textColor}"
      fill-rule="evenodd"
    />
    <path
      d="m10.4644 12.6278v5.309h-5.23365v-5.309h5.23365v-5.3059h-9.547447c-.122288.00081-.243196.0259-.355701.07383-.112505.04794-.214364.11775-.29966.20538-.085295.08763-.152328.19134-.1972019.3051-.0448742.11376-.06669581.2353-.06419744.35757v14.06532c-.00249837.1223.01932324.2438.06419744.3576.0448739.1137.1119069.2175.1972019.3051.085296.0876.187155.1574.29966.2054.112505.0479.233413.073.355701.0738h13.851847c.1223-.0008.2432-.0259.3557-.0738.1125-.048.2144-.1178.2997-.2054s.1523-.1914.1972-.3051c.0449-.1138.0667-.2353.0642-.3576v-9.7013z"
      fill="url(#${id})"
    />
    <path
      d="m10.4636 2.01256v5.30904h5.2463v5.3059h5.218v-9.68562c.0025-.12227-.0194-.24381-.0642-.35757-.0449-.11376-.1119-.21747-.1972-.3051s-.1872-.15744-.2997-.20537c-.1125-.04794-.2334-.07303-.3557-.07384z"
      fill="${colors.iconColor}"
    />
  </svg>`;
};

/**
 * __Compass logo__
 *
 * The Compass logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const CompassLogo = ({
  appearance,
  label = 'Compass',
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
