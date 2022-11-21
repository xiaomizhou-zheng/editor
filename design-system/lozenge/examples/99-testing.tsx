import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import Lozenge from '../src';

export default function Example() {
  return (
    <AtlaskitThemeProvider mode="light">
      <Stack gap="scale.100">
        <Box>
          <Text>
            default: <Lozenge testId="default-lozenge">default</Lozenge>
          </Text>
        </Box>

        <Box>
          <Text>
            appearance: new{' '}
            <Lozenge appearance="new" testId="new-lozenge">
              New
            </Lozenge>
          </Text>
        </Box>

        <Box>
          <Text>
            style: {`{ backgroundColor: 'green' }`}{' '}
            <Lozenge
              // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
              style={{ backgroundColor: 'green' }}
              testId="themed-lozenge"
            >
              Success
            </Lozenge>
          </Text>
        </Box>
      </Stack>
    </AtlaskitThemeProvider>
  );
}
