/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import Spinner from '../src';

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const animationStyles = css({
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  'svg, span': {
    animationDuration: '0s',
    animationTimingFunction: 'step-end',
  },
});

export default () => (
  <div css={animationStyles}>
    <Spinner testId="spinner" />
  </div>
);
