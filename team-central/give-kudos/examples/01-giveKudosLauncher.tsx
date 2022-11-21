import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';
import styled from 'styled-components';

import Button from '@atlaskit/button/standard-button';
import Flag, { FlagGroup, FlagProps } from '@atlaskit/flag';

import { GiveKudosLauncher } from '../src';

export const Wrap = styled.div`
  margin-bottom: 20px;
`;

export const MainStage = styled.div`
  margin: 16px;
`;

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const [flags, setFlags] = useState<Array<FlagProps>>([]);

  const addFlag = (flag: FlagProps) => {
    setFlags(current => [flag, ...current]);
  };

  const dismissFlag = useCallback(
    (id: string | number) => {
      setFlags(current => current.filter(flag => flag.id !== id));
    },
    [setFlags],
  );

  const openGiveKudos = () => {
    setIsOpen(true);
  };

  const kudosClosed = () => {
    setIsOpen(false);
  };

  return (
    <IntlProvider key={'en'} locale={'en'}>
      <MainStage>
        <Wrap>
          <Button onClick={openGiveKudos}>Give Kudos</Button>
        </Wrap>
        <GiveKudosLauncher
          testId={'giveKudosLauncher'}
          isOpen={isOpen}
          onClose={kudosClosed}
          analyticsSource={'test'}
          teamCentralBaseUrl={'http://localhost:3000'}
          cloudId={'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5'}
          addFlag={addFlag}
        />
        <FlagGroup onDismissed={dismissFlag}>
          {flags.map(flag => (
            <Flag {...flag} />
          ))}
        </FlagGroup>
      </MainStage>
    </IntlProvider>
  );
}
