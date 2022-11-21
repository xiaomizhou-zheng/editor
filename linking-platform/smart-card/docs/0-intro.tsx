import React from 'react';
import {
  code,
  md,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  Turns a URL into a card with JSON-LD metadata sourced from either:

  - a Client which communicates with Object Resolver Service;
  - a Client which with a custom fetch function (defined by you!).

  If you have any questions, you can reach out to [#help-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV) for help.

  ## Usage

  ${code`import { Provider, Card } from '@atlaskit/smart-card';`}

  In the Fabric Editor - wrap your instance of the Editor:

  ${code`
    <SmartCardProvider>
      <Editor />
    </SmartCardProvider>
  `}

  In the Fabric Renderer - wrap your instance of the Renderer:

  ${code`
    <SmartCardProvider>
      <Renderer />
    </SmartCardProvider>
  `}

  ## Examples

  You must be logged in at [https://pug.jira-dev.com](https://pug.jira-dev.com) to load the examples.

  ${(
    <Example
      Component={require('../examples/3-basic-example').default}
      title="An editable example"
      source={require('!!raw-loader!../examples/3-basic-example')}
    />
  )}

${(
  <Props
    heading="Smart Link Props"
    props={require('!!extract-react-types-loader!../src/view/CardWithUrl/loader')}
  />
)}

`;
