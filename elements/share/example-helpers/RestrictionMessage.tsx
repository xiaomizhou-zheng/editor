/** @jsx jsx */

import { jsx } from '@emotion/react';

import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import { token } from '@atlaskit/tokens';

const message =
  'Restrictions on this page may prevent people from viewing or editing';

export default () => (
  <div
    css={{
      maxWidth: '100%',
      color: `${token('color.text.danger', '#de350c')}`,
      display: 'flex',
      '& > div': {
        flexGrow: 1,
        lineHeight: 24,
      },
    }}
  >
    <LockFilledIcon label={message} /> <div>{message}</div>
  </div>
);
