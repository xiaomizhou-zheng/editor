/** @jsx jsx */
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { css, Global, jsx } from '@emotion/react';

import Page from '@atlaskit/page';
import SectionMessage from '@atlaskit/section-message';
import { exampleTokens } from './flexible-ui';

const horizontalWrapperStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 5px;
`;

const testWrapperStyles = css`
  padding: 30px;
  background-color: ${exampleTokens.backgroundColor};
`;

export type VRTestWrapperOptions = {
  title: string;
  children: React.ReactNode;
};

// Mocking Date.now for tests to be consistent
Date.now = () => new Date('2022-01-25T16:44:00.000+1000').getTime();

export const VRTestWrapper = ({ title, children }: VRTestWrapperOptions) => (
  <IntlProvider locale={'en'}>
    <Page>
      <div css={testWrapperStyles}>
        <Global
          styles={css`
            // For VR testing purposes we are overriding the animation timing
            // for both the fade-in and the rotating animations. This will
            // freeze animation avoiding potential for VR test flakiness.
            * {
              animation-timing-function: step-end !important;
              animation-duration: 0s !important;
              transition-timing-function: step-end !important;
              transition-duration: 0s !important;
            }
          `}
        />
        <SectionMessage title="Visual regression test">
          <p>Following example is used in visual regression tests.</p>
        </SectionMessage>

        <h6
          css={css`
            margin-top: 28px;
            margin-bottom: 8px;
          `}
        >
          {title}
        </h6>
        {children}
      </div>
    </Page>
  </IntlProvider>
);

export const HorizontalWrapper: React.FC = ({ children }) => (
  <div css={horizontalWrapperStyles}>{children}</div>
);
