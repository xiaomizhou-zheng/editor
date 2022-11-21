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
  <svg
    fill="none"
    height="32"
    viewBox="0 0 54 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="m37.364 24.0872c-2.2526 0-3.6836-1.0771-3.6836-3.6103v-16.01007h2.3652v15.73457c0 1.2525.8248 1.6815 1.8433 1.6815.2295.0041.459-.0053.6874-.0282v2.1198c-.3979.0875-.8051.1254-1.2123.1127zm-22.9014-.0845v-18.10176h-2.4745v7.90646h-9.51362v-7.90646h-2.47448v18.10176h2.47448v-7.8281h9.51362v7.8281zm8.6324.2756c2.1184 0 3.768-.9363 4.646-2.7555l.0031 2.4799h2.3651v-13.7775h-2.3651v2.4267c-.828-1.7911-2.3652-2.70225-4.3741-2.70225-3.8492 0-5.7738 3.28155-5.7738 7.16425 0 4.0519 1.8434 7.1644 5.4988 7.1644zm4.646-6.6132c0 3.0592-1.8965 4.4088-4.0117 4.4088-2.4495 0-3.7805-1.6533-3.7805-4.96 0-3.1938 1.3747-4.9599 4.0429-4.9599 2.0184 0 3.7493 1.3527 3.7493 4.4088zm15.4811 11.7108v-7.7968c.8248 1.7911 2.362 2.6991 4.3709 2.6991 3.8492 0 5.7738-3.2784 5.7738-7.1643 0-4.033-1.8434-7.16425-5.4988-7.16425-2.1183 0-3.768.93935-4.6459 2.75545v-2.4799h-2.3652v19.1507zm0-12.8131c0-3.0561 1.8964-4.4088 4.0116-4.4088 2.4495 0 3.768 1.6533 3.7805 4.9599 0 3.1971-1.3747 4.96-4.0429 4.96-2.0183 0-3.7492-1.3496-3.7492-4.4089z"
      fill="${colors.textColor}"
      fill-rule="evenodd"
    />
  </svg>`;
};

/**
 * __Halp wordmark__
 *
 * The Halp brand/product name styled as a logo, without an accompanying icon.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const HalpWordmark = ({
  appearance,
  label = 'Halp',
  size = defaultLogoParams.size,
  testId,
  textColor = defaultLogoParams.textColor,
}: LogoProps) => {
  return (
    <Wrapper
      appearance={appearance}
      label={label}
      size={size}
      svg={svg({ appearance, textColor })}
      testId={testId}
      textColor={textColor}
    />
  );
};
