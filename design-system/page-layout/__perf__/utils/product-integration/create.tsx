import React from 'react';

import { Create } from '@atlaskit/atlassian-navigation';
import noop from '@atlaskit/ds-lib/noop';
import { token } from '@atlaskit/tokens';

const StyledTooltip = () => (
  <span>
    Create
    <span style={{ color: token('color.text.accent.orange', 'orange') }}>
      {' '}
      [c]
    </span>
  </span>
);

export const DefaultCreate = () => (
  <Create
    buttonTooltip={<StyledTooltip />}
    iconButtonTooltip="Create button"
    onClick={noop}
    text="Create"
    testId="create-cta"
  />
);
