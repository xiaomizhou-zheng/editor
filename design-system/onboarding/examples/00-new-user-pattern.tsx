/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import { ProgressIndicator } from '@atlaskit/progress-indicator';
import { token } from '@atlaskit/tokens';

import { SpotlightCard } from '../src';

const wrapperStyles = css({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const headingStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const taglineStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value ``${gridSize * 2}px``
  paddingBottom: token('spacing.scale.200', '16px'),
});

const optionStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value ``${gridSize / 2}px``
  padding: token('spacing.scale.050', '4px'),
});

const Option: React.FC<{}> = ({ children }) => (
  <div css={optionStyles}>{children}</div>
);

const NewUser: React.FC<{}> = () => (
  <div css={wrapperStyles}>
    <div>
      <div css={headingStyles}>
        <h2>Welcome to Jira</h2>
        <ProgressIndicator values={[1, 2, 3]} selectedIndex={0} />
      </div>
      <p css={taglineStyles}>
        Tell us about your team so we can personalise your project for you
      </p>
      <SpotlightCard heading="Why are you trying Jira Software?" isFlat>
        <Option>
          <Button>Learn about Agile</Button>
        </Option>
        <Option>
          <Button>Explore the product</Button>
        </Option>
        <Option>
          <Button>Setting it up for my team</Button>
        </Option>
      </SpotlightCard>
    </div>
  </div>
);

export default NewUser;
