/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { useState } from 'react';

import Button from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { N0 } from '@atlaskit/theme/colors';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../../src';

import CodeSandboxIcon from './example-components/code-sandbox-icon';

const SpotlightHeadingAfterElement = () => {
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const start = () => setIsSpotlightActive(true);
  const end = () => setIsSpotlightActive(false);
  return (
    <SpotlightManager>
      <SpotlightTarget name="codesandbox">
        <Button iconBefore={<CodeSandboxIcon />} />
      </SpotlightTarget>
      <div style={{ marginTop: '16px' }}>
        <Button appearance="primary" onClick={() => start()}>
          Show example spotlight
        </Button>
      </div>

      <SpotlightTransition>
        {isSpotlightActive && (
          <Spotlight
            headingAfterElement={
              <Button
                iconBefore={<CrossIcon label="Close" primaryColor={N0} />}
                appearance="subtle"
                onClick={() => end()}
              />
            }
            actions={[
              {
                onClick: () => end(),
                text: 'OK',
              },
            ]}
            heading="Open CodeSandbox"
            target="codesandbox"
            key="codesandbox"
            targetRadius={3}
            targetBgColor={N0}
          >
            A sandboxed environment where you can play around with examples is
            now only one click away.
          </Spotlight>
        )}
      </SpotlightTransition>
    </SpotlightManager>
  );
};

export default SpotlightHeadingAfterElement;
