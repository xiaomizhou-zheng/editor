import React from 'react';

import InlineMessage from '../src';

const MessageContent = (
  <div>
    <h4>Authenticate heading</h4>
    <span>
      Authenticate <a href="https://atlaskit.atlassian.com/">here</a> to see
      more information
    </span>
  </div>
);

export default () => (
  <InlineMessage
    appearance="connectivity"
    title="JIRA Service Desk"
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    secondaryText="Carrot cake chocolate bar caramels."
    placement="right"
  >
    {MessageContent}
  </InlineMessage>
);
