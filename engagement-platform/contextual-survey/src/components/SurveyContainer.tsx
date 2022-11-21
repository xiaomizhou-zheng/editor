/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { N0, N50, N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { surveyInnerWidth } from '../constants';

interface Props {
  children: React.ReactNode;
  onDismiss: () => void;
}

const padding: number = gridSize() * 3;

export default ({ children, onDismiss }: Props) => {
  return (
    <div
      css={css`
        background-color: ${token('elevation.surface.overlay', N0)};
        border-radius: ${borderRadius()}px;
        padding: ${padding}px;
        box-shadow: ${token(
          'elevation.shadow.overlay',
          `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`,
        )};
        width: ${surveyInnerWidth}px;
      `}
    >
      <div
        css={css`
          position: absolute;
          top: ${padding - gridSize()}px;
          right: ${padding - gridSize()}px;
        `}
      >
        <Button
          iconBefore={
            <CrossIcon
              label=""
              primaryColor={token('color.icon.subtle', N50)}
            />
          }
          aria-label="Dismiss"
          appearance="subtle"
          onClick={onDismiss}
        />
      </div>
      {children}
    </div>
  );
};
