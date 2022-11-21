/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Card, Client, Provider } from '@atlaskit/smart-card';
import { VRTestWrapper } from './utils/vr-test';
import { JsonLd } from 'json-ld-types';
import { BitbucketFile } from '../examples-helpers/_jsonLDExamples/provider.bitbucket';
import { useCallback, useState } from 'react';
import { CardStore } from '@atlaskit/linking-common';
import Button from '@atlaskit/button';

class CustomClient extends Client {
  fetchData() {
    return Promise.resolve(
      BitbucketFile as JsonLd.Response<JsonLd.Data.Document>,
    );
  }
}

export default () => {
  const [initialState, setInitialState] = useState<CardStore>({});
  const resetInitialStoreState = useCallback(() => {
    setInitialState({});
  }, [setInitialState]);
  return (
    <VRTestWrapper title="Edge case: reload links when redux store is has been reset">
      <Provider
        client={new CustomClient('staging')}
        storeOptions={{ initialState }}
      >
        <Button
          testId={'reset-redux-store-button'}
          appearance={'primary'}
          onClick={resetInitialStoreState}
        >
          Reset store initial state
        </Button>
        <br />
        <br />
        <Card
          appearance="inline"
          testId="inline-card"
          url={
            'https://bitbucket.org/atlassian/atlassian-frontend/src/master/README.md'
          }
        />
      </Provider>
    </VRTestWrapper>
  );
};
