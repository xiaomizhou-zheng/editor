/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { DropIndicator } from '../../src/box';

const dropTargetStyles = css({
  position: 'relative',
  display: 'inline-block',
  border: `1px solid ${token('color.border', 'lightgrey')}`,
});

export default function ClosestEdgeExample() {
  return (
    <div css={dropTargetStyles}>
      <span>Drop target</span>
      <DropIndicator edge="top" />
    </div>
  );
}
