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
    id = `bitbucketLogo-${appearance}`;
  }

  return `
  <svg viewBox="0 0 137 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="100.866322%" y1="25.6261254%" x2="46.5685299%" y2="75.2076031%" id="${id}">
        <stop stop-color="${colors.iconGradientStart}" ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="evenodd">
      <path d="M22.38125,13.1176316 L15.3425,13.1176316 L14.16125,20.0504386 L9.28624997,20.0504386 L3.52999997,26.9266667 C3.71244766,27.0853527 3.94506033,27.173594 4.18624997,27.175614 L19.46375,27.175614 C19.8352946,27.180424 20.1543287,26.9108682 20.21375,26.5419298 L22.38125,13.1176316 Z" fill="url(#${id})" fill-rule="nonzero"></path>
      <path fill="${
        colors.iconColor
      }" fill-rule="nonzero" d="M0.759678147,6 C0.53811485,5.99712567 0.326627812,6.09294508 0.181948325,6.26175474 C0.0372688368,6.4305644 -0.0257933559,6.65508453 0.00967814748,6.87508772 L3.19342815,26.315614 C3.23255884,26.5521357 3.35340224,26.7671859 3.53467815,26.9228947 L3.53467815,26.9228947 C3.71712584,27.0815808 3.94973851,27.169822 4.19092815,27.1718421 L10.1009281,20.0504386 L9.27217815,20.0504386 L7.97092815,13.1176316 L22.3859281,13.1176316 L23.3984281,6.88263158 C23.4360238,6.66342534 23.375521,6.43870373 23.2330921,6.26853487 C23.0906632,6.09836602 22.880829,6.00009878 22.6596781,6 L0.759678147,6 Z"></path>
      <path fill="${
        colors.textColor
      }" d="M32,8.352 L38.63,8.352 C42.114,8.352 43.804,10.068 43.804,12.824 C43.804,14.878 42.868,16.152 40.944,16.62 C43.466,17.036 44.714,18.414 44.714,20.832 C44.714,23.562 42.868,25.434 39.046,25.434 L32,25.434 L32,8.352 Z M38.318,10.588 L34.34,10.588 L34.34,15.684 L38.318,15.684 C40.528,15.684 41.438,14.67 41.438,13.032 C41.438,11.368 40.45,10.588 38.318,10.588 Z M39.072,17.764 L34.34,17.764 L34.34,23.094 L39.124,23.094 C41.36,23.094 42.374,22.288 42.374,20.572 C42.374,18.752 41.412,17.764 39.072,17.764 Z M47.236,9.002 C47.236,9.99 47.886,10.562 48.796,10.562 C49.706,10.562 50.356,9.99 50.356,9.002 C50.356,8.014 49.706,7.442 48.796,7.442 C47.886,7.442 47.236,8.014 47.236,9.002 Z M47.652,25.434 L49.888,25.434 L49.888,12.434 L47.652,12.434 L47.652,25.434 Z M56.362,21.326 L56.362,14.514 L59.82,14.514 L59.82,12.434 L56.362,12.434 L56.362,9.678 L54.178,9.678 L54.178,12.434 L52.072,12.434 L52.072,14.514 L54.178,14.514 L54.178,21.378 C54.178,23.796 55.53,25.434 58.312,25.434 C58.988,25.434 59.43,25.33 59.82,25.226 L59.82,23.068 C59.43,23.146 58.936,23.25 58.416,23.25 C57.038,23.25 56.362,22.47 56.362,21.326 Z M74.51,18.934 C74.51,22.6 72.69,25.694 69.05,25.694 C67.152,25.694 65.696,24.836 64.916,23.146 L64.916,25.434 L62.68,25.434 L62.68,7 L64.916,7 L64.916,14.774 C65.748,13.058 67.308,12.174 69.31,12.174 C72.768,12.174 74.51,15.112 74.51,18.934 Z M72.274,18.934 C72.274,15.814 71.026,14.254 68.712,14.254 C66.71,14.254 64.916,15.528 64.916,18.414 L64.916,19.454 C64.916,22.34 66.554,23.614 68.452,23.614 C70.974,23.614 72.274,21.95 72.274,18.934 Z M76.85,20.052 C76.85,23.64 78.566,25.694 81.556,25.694 C83.298,25.694 84.832,24.836 85.664,23.302 L85.664,25.434 L87.9,25.434 L87.9,12.434 L85.664,12.434 L85.664,19.662 C85.664,22.288 84.234,23.666 82.154,23.666 C80.022,23.666 79.086,22.626 79.086,20.286 L79.086,12.434 L76.85,12.434 L76.85,20.052 Z M100.458,23.094 C99.652,23.38 98.82,23.562 97.494,23.562 C94.088,23.562 92.684,21.43 92.684,18.908 C92.684,16.386 94.062,14.254 97.442,14.254 C98.664,14.254 99.548,14.488 100.38,14.878 L100.38,12.798 C99.366,12.33 98.456,12.174 97.286,12.174 C92.658,12.174 90.5,14.982 90.5,18.908 C90.5,22.886 92.658,25.694 97.286,25.694 C98.482,25.694 99.678,25.512 100.458,25.096 L100.458,23.094 Z M105.242,25.434 L105.242,19.35 L110.962,25.434 L114.004,25.434 L107.634,18.83 L113.744,12.434 L110.832,12.434 L105.242,18.518 L105.242,7 L103.006,7 L103.006,25.434 L105.242,25.434 Z M126.224,24.914 C125.158,25.486 123.52,25.694 122.194,25.694 C117.332,25.694 115.2,22.886 115.2,18.908 C115.2,14.982 117.384,12.174 121.336,12.174 C125.34,12.174 126.952,14.956 126.952,18.908 L126.952,19.922 L117.462,19.922 C117.774,22.132 119.204,23.562 122.272,23.562 C123.78,23.562 125.054,23.276 126.224,22.86 L126.224,24.914 Z M121.232,14.202 C118.866,14.202 117.67,15.736 117.436,17.998 L124.69,17.998 C124.56,15.58 123.468,14.202 121.232,14.202 Z M132.698,21.326 L132.698,14.514 L136.156,14.514 L136.156,12.434 L132.698,12.434 L132.698,9.678 L130.514,9.678 L130.514,12.434 L128.408,12.434 L128.408,14.514 L130.514,14.514 L130.514,21.378 C130.514,23.796 131.866,25.434 134.648,25.434 C135.324,25.434 135.766,25.33 136.156,25.226 L136.156,23.068 C135.766,23.146 135.272,23.25 134.752,23.25 C133.374,23.25 132.698,22.47 132.698,21.326 Z"></path>
    </g>
  </svg>`;
};

/**
 * __Bitbucket logo__
 *
 * The Bitbucket logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const BitbucketLogo = ({
  appearance,
  label = 'Bitbucket',
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
