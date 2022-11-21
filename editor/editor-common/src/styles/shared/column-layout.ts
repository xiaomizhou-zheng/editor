import { css } from '@emotion/react';

import { gridMediumMaxWidth } from '@atlaskit/editor-shared-styles';

const columnLayoutSharedStyle = css`
  [data-layout-section] {
    position: relative;
    display: flex;
    flex-direction: row;
    & > * {
      flex: 1;
      min-width: 0;
    }

    & > .unsupportedBlockView-content-wrap {
      min-width: initial;
    }

    @media screen and (max-width: ${gridMediumMaxWidth}px) {
      flex-direction: column;
    }
  }
`;

export { columnLayoutSharedStyle };
