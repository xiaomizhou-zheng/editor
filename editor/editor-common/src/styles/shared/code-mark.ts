import { css } from '@emotion/react';

import { getCodeStyles } from '@atlaskit/code/inline';
import { DN70, N30A } from '@atlaskit/theme/colors';
import { getTheme, themed } from '@atlaskit/theme/components';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

export const codeMarkSharedStyles = (props: ThemeProps) => {
  const theme = getTheme(props);
  return css`
    .code {
      --ds--code--bg-color: ${themed({
        light: token('color.background.neutral', N30A),
        dark: token('color.background.neutral', DN70),
      })(props)};
      ${getCodeStyles(theme)}
    }
  `;
};
