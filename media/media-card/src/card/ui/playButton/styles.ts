import { css } from '@emotion/react';
import { N0, N90A } from '@atlaskit/theme/colors';

export const playButtonClassName = 'media-card-play-button';

export const bkgClassName = 'play-icon-background';

const discSize = 48;
const discSizeHover = 56;

export const fixedPlayButtonStyles = `
  .${bkgClassName} {
    width: ${discSizeHover}px;
    height: ${discSizeHover}px;
  }
`;

export const playButtonWrapperStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${N0};
  span {
    position: absolute;
  }
`;

export const backgroundStyles = css`
  transition-property: width, height;
  transition-duration: 0.1s;
  position: absolute;
  width: ${discSize}px;
  height: ${discSize}px;
  background: ${N90A};
  border-radius: 100%;
`;
