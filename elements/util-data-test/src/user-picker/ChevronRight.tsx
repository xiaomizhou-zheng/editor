/** @jsx jsx */
import { useCallback, useState } from 'react';
import { css, jsx } from '@emotion/core';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { N50, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
const wrapper = css({
  display: 'flex',
});
export default () => {
  const [isMouseHovered, setHoverState] = useState(false);
  const onMouseEnter = useCallback(() => setHoverState(true), [setHoverState]);
  const onMouseLeave = useCallback(() => setHoverState(false), [setHoverState]);
  return (
    <div css={wrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <ChevronRightIcon
        testId="chevron-right-icon"
        label="chevron right"
        size="large"
        primaryColor={token('color.text.subtlest', isMouseHovered ? N200 : N50)}
      />
    </div>
  );
};
