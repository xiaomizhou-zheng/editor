import React from 'react';

import {
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import Lozenge from '../src';

export default function Example() {
  return (
    <Stack gap="scale.100" testId="test-container">
      <Text>
        default: <Lozenge>default</Lozenge>
      </Text>
      <Text>
        appearance: new <Lozenge appearance="new">New</Lozenge>
      </Text>
      <Text>
        style: {`{ backgroundColor: 'green' }`}{' '}
        <Lozenge
          testId="lozenge-custom-color1"
          /* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */
          style={{ backgroundColor: 'green' }}
        >
          Success
        </Lozenge>
      </Text>
      <Text>
        style: {`{ backgroundColor: 'yellow', color: 'blue' }`}{' '}
        <Lozenge
          testId="lozenge-custom-color2"
          /* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */
          style={{ backgroundColor: 'yellow', color: 'blue' }}
        >
          Custom
        </Lozenge>
      </Text>
    </Stack>
  );
}
