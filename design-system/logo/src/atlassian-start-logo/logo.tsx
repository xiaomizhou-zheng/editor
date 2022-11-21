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
    // We treat the word "Atlassian" differently to normal product logos, it has a bold brand look
    atlassianLogoTextColor: textColor,
  };
  // Will be fixed upon removal of deprecated iconGradientStart and
  // iconGradientStop props, or with React 18's useId() hook when we update.
  // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
  let id = uid({ iconGradientStart: iconGradientStop });

  if (appearance) {
    colors = getColorsFromAppearance(appearance);
    id = `atlassianLogo-${appearance}`;
  }

  return `
<svg fill="none" viewBox="0 0 270 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true"2>
  <defs>
    <linearGradient
      id="${id}"
      gradientUnits="userSpaceOnUse"
      x1="9.85184"
      x2="3.72154"
      y1="13.0072"
      y2="23.6252"
    >
      <stop offset="0" stop-color="${colors.iconGradientStart}" ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
      <stop offset="92%" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
  </defs>
  <g>
    <path
      d="m6.67038 11.2143c-.07074-.0921-.16397-.1644-.27073-.2099-.10676-.0456-.22345-.0629-.33885-.0503-.11539.0125-.22561.0546-.32004.1221s-.16989.1582-.21914.2633l-5.804641 11.6165c-.053275.1055-.07859.2229-.073521.3409.005069.1181.040351.2329.102472.3334.06212.1006.149001.1835.25232999.2409.10332901.0573.21965001.0872.33783401.0868h8.087846c.12984.0039.25797-.0303.36862-.0983.11064-.0681.19897-.167.25408-.2846 1.74286-3.6038.68711-9.0828-2.37626-12.3608z"
      fill="url(#${id})"
    />
    <path
      fill="${colors.iconColor}"
      d="m10.9326.649949c-1.44794 2.227461-2.29174 4.793151-2.4486 7.445211-.15685 2.65204.37864 5.29934 1.5539 7.68194l3.8972 7.798c.0579.1154.1469.2124.2569.28.11.0677.2367.1033.3658.1029h8.0878c.1182.0004.2346-.0295.3379-.0868.1033-.0574.1902-.1403.2523-.2409.0621-.1005.0974-.2153.1025-.3334.0051-.118-.0203-.2355-.0735-.3409l-11.1513-22.309629c-.0537-.111145-.1377-.204841-.2424-.270285-.1047-.065443-.2257-.099968-.3492-.099594-.1234.000374-.2442.035633-.3485.101709-.1043.066077-.1878.16028-.2408.271748z"
    />
    <g fill="${colors.atlassianLogoTextColor}">
      <path
        clip-rule="evenodd"
        d="m139.715 18.207c0-3.4105-1.807-5.0102-6.906-6.1088-2.82-.6227-3.5-1.2454-3.5-2.14723 0-1.12729 1.009-1.60326 2.863-1.60326 2.251 0 4.477.68353 6.581 1.63189v-4.46263c-2.021-.92008-4.222-1.37618-6.442-1.33486-5.042 0-7.651 2.19374-7.651 5.78317 0 2.86292 1.335 5.15692 6.553 6.16612 3.113.6513 3.768 1.1559 3.768 2.1937s-.655 1.6605-2.863 1.6605c-2.651-.0477-5.249-.751-7.562-2.047v4.6881c1.575.7694 3.65 1.6283 7.515 1.6283 5.454 0 7.619-2.4299 7.619-6.048zm-25.788-6.1088c5.1 1.0987 6.911 2.6983 6.911 6.1088 0 3.6181-2.165 6.048-7.623 6.048-3.868 0-5.944-.8589-7.515-1.6283v-4.6881c2.309 1.2953 4.904 1.9986 7.551 2.047 2.212 0 2.863-.6227 2.863-1.6605s-.651-1.5424-3.765-2.1937c-5.213-1.0083-6.55-3.299-6.552-6.15828l-.015-.00783c0-3.58943 2.609-5.78317 7.652-5.78317 2.219-.04048 4.42.41558 6.441 1.33485v4.46263c-2.108-.94835-4.33-1.63188-6.585-1.63188-1.853 0-2.863.47597-2.863 1.60326 0 .90182.684 1.52452 3.5 2.14722zm61.966-7.61904v19.47884h4.151v-14.85517l1.75 3.94377 5.869 10.9114h5.221v-19.47884h-4.155v12.57194l-1.571-3.6467-4.713-8.92524zm-30.942 0h4.538v19.48244h-4.538zm-74.3973 19.47884v-19.47884h4.5664v15.27024h6.227l-1.4709 4.2086zm-18.4231-19.47884v4.20854h5.0388v15.2703h4.5664v-15.2703h5.3967v-4.20854zm-12.6077-.00716h5.9836l6.7888 19.4788h-5.1927l-.9627-3.2781c-2.3714.6969-4.8933.6969-7.2647 0l-.9627 3.2781h-5.1891zm.4867 12.3286c.8135.239 1.6572.3595 2.5051.3579v.0071c.8482-.001 1.6919-.124 2.5051-.365l-2.5051-8.50298zm55.9457-12.3286h-6.0015l-6.7995 19.4788h5.1891l.9627-3.2781c2.3725.6976 4.8957.6976 7.2683 0l.9627 3.2781h5.1889zm-2.9954 12.6936c-.8479.0017-1.6916-.1189-2.5051-.3578l2.5051-8.50302 2.5051 8.50302c-.8135.2388-1.6572.3594-2.5051.3578zm66.8931-12.6936h5.969l6.8 19.4788h-5.19l-.962-3.2781c-2.372.6969-4.894.6969-7.265 0l-.963 3.2781h-5.189zm.472 12.3286c.814.2384 1.657.3589 2.505.3579l.015.0071c.843-.0026 1.682-.1255 2.49-.365l-2.505-8.50298z"
        fill-rule="evenodd"
      />
    </g>
    <g fill="${colors.textColor}">
      <path
        clip-rule="evenodd"
        d="m210.985 24.2765c-4.047 0-5.926-.7981-7.551-1.6247v-2.931c1.943 1.0199 4.939 1.75 7.709 1.75 3.152 0 4.333-1.2418 4.333-3.0884s-1.148-2.8164-5.131-3.7899c-4.714-1.1487-6.8-2.7734-6.8-6.21257 0-3.24945 2.487-5.67223 7.361-5.67223 3.024 0 4.968.71574 6.403 1.52811v2.86295c-1.997-1.10283-4.251-1.65375-6.531-1.5961-2.738 0-4.363.95909-4.363 2.86296 0 1.71778 1.339 2.58028 5.032 3.50358 4.427 1.1129 6.914 2.548 6.914 6.3056-.018 3.6467-2.183 6.1017-7.376 6.1017zm17.042-2.8987c.579-.0169 1.154-.0924 1.718-.2255v2.6447c-.6.1729-1.222.2585-1.847.254-3.407 0-5.064-2.004-5.064-4.9672v-8.5065h-2.58v-2.54807h2.58v-3.37829h2.674v3.37829h4.237v2.54807h-4.237v8.4421c0 1.4028.83 2.3584 2.519 2.3584zm10.017 2.8987c2.437 0 4.348-1.0844 5.368-3.1851l.014 2.8666h2.741v-15.92879h-2.741v2.80209c-.955-2.07203-2.738-3.12059-5.064-3.12059-4.462 0-6.692 3.78979-6.692 8.28109 0 4.6845 2.137 8.2847 6.374 8.2847zm5.368-7.6477c0 3.5358-2.197 5.0997-4.652 5.0997-2.835 0-4.363-1.9146-4.363-5.7438 0-3.6861 1.593-5.726 4.685-5.726 2.322 0 4.33 1.5604 4.33 5.0961zm9.555 7.3292h-2.688v-15.92878h2.674v2.80208c.926-1.87878 2.505-3.22079 5.64-3.02754v2.67684c-3.504-.3578-5.64.7158-5.64 4.0797zm16.025-2.8057c-.564.1328-1.141.2083-1.721.2255-1.689 0-2.516-.9556-2.516-2.3584v-8.4421h4.248v-2.54807h-4.237v-3.37829h-2.677v3.37829h-2.591v2.54807h2.58v8.5065c0 2.9632 1.657 4.9672 5.064 4.9672.626.0042 1.249-.0814 1.85-.254z"
        fill-rule="evenodd"
      />
    </g>
  </g>
</svg>`;
};

/**
 * __Atlassian start logo__
 *
 * The Atlassian Start logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const AtlassianStartLogo = ({
  appearance,
  label = 'Atlassian Start',
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
        label,
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
