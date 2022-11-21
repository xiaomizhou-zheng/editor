import React, { useCallback, useState } from 'react';

import styled from 'styled-components';

import Flag, { FlagGroup, FlagProps } from '@atlaskit/flag';

import ProfileCardResourced from '../src';
import ProfileCardTrigger from '../src/components/User';

import ExampleWrapper from './helper/example-wrapper';
import { getMockProfileClient } from './helper/util';

export const Wrap = styled.div`
  margin-bottom: 20px;
`;

export const MainStage = styled.div`
  margin: 16px;
`;

export default function Example() {
  const [flags, setFlags] = useState<Array<FlagProps>>([]);

  const addFlag = (flag: FlagProps) => {
    setFlags((current) => [flag, ...current]);
  };

  const dismissFlag = useCallback(
    (id: string | number) => {
      setFlags((current) => current.filter((flag) => flag.id !== id));
    },
    [setFlags],
  );

  const mockClient = getMockProfileClient(
    10,
    0,
    {},
    {
      url: 'DUMMY',
      teamCentralUrl: 'teamCentralUrl',
      teamCentralBaseUrl: 'http://localhost:3000',
      productIdentifier: 'test',
      cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
    },
  );

  const defaultProps = {
    cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
    resourceClient: mockClient,
    actions: [
      {
        label: 'View profile',
        id: 'view-profile',
        callback: () => {},
      },
    ],
  };

  return (
    <ExampleWrapper>
      <MainStage>
        <Wrap>
          <ProfileCardResourced
            {...defaultProps}
            userId="655363:3ddf0886-bc87-42aa-b1ba-32e4991e99d8"
            addFlag={addFlag}
          />
        </Wrap>
        <Wrap>
          <ProfileCardTrigger
            {...defaultProps}
            userId="655363:3ddf0886-bc87-42aa-b1ba-32e4991e99d8"
            addFlag={addFlag}
          >
            <strong>hover over me</strong>
          </ProfileCardTrigger>
        </Wrap>
        <FlagGroup onDismissed={dismissFlag}>
          {flags.map((flag) => (
            <Flag {...flag} />
          ))}
        </FlagGroup>
      </MainStage>
    </ExampleWrapper>
  );
}
