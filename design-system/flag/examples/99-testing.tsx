import React, { ReactElement, ReactNode, useRef, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import { G300, P300, R300, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';

type flagData = {
  created: number;
  description: string;
  icon: ReactNode;
  id: number;
  key: number;
  title: string;
  testId: string;
};

const getRandomIcon = () => {
  const icons = iconMap() as { [key: string]: object };
  const iconArray = Object.keys(icons).map((i) => icons[i]);
  return iconArray[Math.floor(Math.random() * iconArray.length)];
};

const iconMap = (key?: string, color?: string) => {
  const icons: { [key: string]: ReactElement } = {
    info: (
      <Info
        label="Info"
        primaryColor={color || token('color.icon.discovery', P300)}
      />
    ),
    success: (
      <Tick
        label="Success"
        primaryColor={color || token('color.icon.success', G300)}
      />
    ),
    warning: (
      <Warning
        label="Warning"
        primaryColor={color || token('color.icon.warning', Y300)}
      />
    ),
    error: (
      <Error
        label="Error"
        primaryColor={color || token('color.icon.danger', R300)}
      />
    ),
  };

  return key ? icons[key] : icons;
};

const getFlagData = (index: number, timeOffset: number = 0): flagData => {
  return {
    created: Date.now() - timeOffset * 1000,
    description: 'I am a flag',
    icon: getRandomIcon(),
    id: index,
    key: index,
    title: `${index + 1}: Whoa a new flag!`,
    testId: `MyFlagTestId--${index + 1}`,
  };
};

const FlagGroupExample = () => {
  const [flags, setFlags] = useState<Array<flagData>>([]);
  let flagCount = useRef(0);

  const addFlag = () => {
    const newFlags = flags.slice();
    newFlags.unshift(getFlagData(flagCount.current++));
    setFlags(newFlags);
  };

  const dismissFlag = () => {
    setFlags(flags.slice(1));
    flagCount.current--;
  };

  const actions = [
    {
      content: 'Nice one!',
      onClick: () => alert('Flag has been clicked!'),
      testId: 'MyFlagAction',
    },
    { content: 'Not right now thanks', onClick: dismissFlag },
  ];

  return (
    <div>
      <FlagGroup onDismissed={dismissFlag}>
        {flags.map((flag) => (
          <Flag actions={actions} {...flag} />
        ))}
      </FlagGroup>
      <Button onClick={addFlag} testId="AddFlag">
        Add Flag
      </Button>
    </div>
  );
};

export default FlagGroupExample;
