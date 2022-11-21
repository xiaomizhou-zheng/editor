/* eslint-disable max-len */
import React from 'react';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, textColor }: LogoProps) => {
  let colors = {
    textColor,
  };

  if (appearance) {
    colors = getColorsFromAppearance(appearance);
  }

  return `
  <svg viewBox="0 0 68 32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <path fill="${colors.textColor}" fill-rule="evenodd" clip-rule="evenodd" d="M42.7193 23.7902C40.2194 23.7902 38.6445 22.5776 38.6445 19.7573V5H42.4858V19.2304C42.4858 20.0477 43.0277 20.3381 43.6834 20.3381C43.8724 20.3421 44.0615 20.3331 44.2493 20.3112V23.6315C43.7491 23.7552 43.2342 23.8086 42.7193 23.7902ZM12.6825 9.98505V6.37431H0V9.98505H4.2754V23.6825H8.40109V9.98505H12.6825ZM14.1201 23.6825H17.9344V16.6227C17.9344 14.464 19.1979 13.8053 21.8775 14.0149V10.027C19.8147 9.89522 18.656 10.973 17.9344 12.7904V10.2096H14.1201V23.6825ZM46.6604 19.7573C46.6604 22.5776 48.2322 23.7902 50.7322 23.7902C51.2491 23.809 51.766 23.7556 52.2681 23.6315V20.3112C52.0793 20.333 51.8893 20.342 51.6993 20.3381C51.0436 20.3381 50.5017 20.0477 50.5017 19.2304V5H46.6604V19.7573ZM54.1147 16.9402C54.1147 12.7786 56.5099 9.93129 60.6356 9.93129C64.7613 9.93129 67.1056 12.7845 67.1056 16.9402C67.1056 21.0958 64.7344 24 60.6356 24C56.5369 24 54.1147 21.0749 54.1147 16.9402ZM57.8512 16.9402C57.8512 18.9701 58.7015 20.5749 60.6356 20.5749C62.5697 20.5749 63.3691 18.9701 63.3691 16.9402C63.3691 14.9103 62.5428 13.3474 60.6356 13.3474C58.7285 13.3474 57.8662 14.9103 57.8662 16.9402H57.8512ZM30.248 18.3621C29.1727 18.3538 28.0984 18.2909 27.0295 18.1734C27.3828 20.0986 28.7959 20.7692 30.8498 20.7692C32.3707 20.7692 33.8558 20.3501 35.1701 19.9309V23.1734C33.7465 23.7133 32.2345 23.9824 30.7121 23.9668C25.5834 23.9668 23.314 21.4009 23.314 17.0806C23.314 12.934 25.9427 9.94 30.0504 9.94C33.1013 9.94 35.6372 12.0058 35.6372 14.7513C35.6372 17.5776 33.1671 18.3621 30.248 18.3621ZM31.9216 14.6166C31.9216 13.6136 31.0534 12.8801 29.9726 12.8801L29.9696 12.8711C29.4667 12.8789 28.9749 13.0206 28.545 13.2816C28.115 13.5426 27.7624 13.9135 27.5235 14.3561C27.2249 14.9118 27.0455 15.5236 26.9966 16.1525C27.6563 16.2551 28.3229 16.3081 28.9905 16.3112C30.5564 16.3112 31.9216 15.91 31.9216 14.6166Z" />
  </svg>
  `;
};

/**
 * __Trello wordmark__
 *
 * The Trello brand/product name styled as a logo, without an accompanying icon.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const TrelloWordmark = ({
  appearance,
  label = 'Trello',
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
      svg={svg({ appearance, textColor })}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      testId={testId}
      textColor={textColor}
    />
  );
};
