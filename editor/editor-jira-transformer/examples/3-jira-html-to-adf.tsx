/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { JIRATransformer } from '../src';

const container = css`
  #source,
  #output {
    box-sizing: border-box;
    margin: 8px;
    padding: 8px;
    white-space: pre-wrap;
    width: 100%;
    &:focus {
      outline: none;
    }
  }

  #source {
    height: 80px;
  }

  #output {
    border: 1px solid;
    min-height: 480px;
  }
`;

const jiraTransformer = new JIRATransformer(defaultSchema);
const adfTransformer = new JSONTransformer();

function getADF(html: string) {
  const pmNode = jiraTransformer.parse(html);
  return adfTransformer.encode(pmNode);
}

export interface State {
  source: string;
}

class Example extends React.PureComponent<{}, State> {
  state: State = { source: '' };

  handleChange = (evt: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({ source: evt.currentTarget.value });
  };

  render() {
    return (
      <div css={container}>
        <textarea id="source" onChange={this.handleChange} />
        <pre id="output">
          {JSON.stringify(getADF(this.state.source), null, 2)}
        </pre>
      </div>
    );
  }
}

export default () => <Example />;
