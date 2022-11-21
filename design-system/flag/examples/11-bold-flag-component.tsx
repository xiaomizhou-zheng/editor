import React, { CSSProperties, ReactElement } from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import { G400, N500, R300, Y300 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import Flag from '../src';
import { AppearanceTypes } from '../src/types';

const actions = [
  { content: 'Understood', onClick: noop },
  { content: 'No Way!', onClick: noop },
];
const appearances: { [key: string]: { description: string; title: string } } = {
  error: {
    description: 'You need to take action, something has gone terribly wrong!',
    title: 'Uh oh!',
  },
  info: {
    description:
      "This alert needs your attention, but it's not super important.",
    title: 'Hey, did you know...',
  },
  success: {
    description: 'Nothing to worry about, everything is going great!',
    title: 'Good news, everyone',
  },
  warning: {
    description: 'Pay attention to me, things are not going according to plan.',
    title: 'Heads up!',
  },
};

const iconMap = (key: string) => {
  const icons: { [key: string]: ReactElement } = {
    info: (
      <Info
        label="Info"
        secondaryColor={token('color.background.neutral.bold', N500)}
      />
    ),
    success: (
      <Tick
        label="Success"
        secondaryColor={token('color.background.success.bold', G400)}
      />
    ),
    warning: (
      <Warning
        label="Warning"
        secondaryColor={token('color.background.warning.bold', Y300)}
      />
    ),
    error: (
      <Error
        label="Error"
        secondaryColor={token('color.background.danger.bold', R300)}
      />
    ),
  };

  return key ? icons[key] : icons;
};

const getIcon = (key: string) => {
  return iconMap(key) as ReactElement;
};

export default () => (
  <div>
    {Object.keys(appearances).map((type, idx) => (
      <div
        key={type}
        style={idx ? ({ marginTop: gridSize() } as CSSProperties) : undefined}
      >
        <Flag
          actions={actions}
          appearance={type as AppearanceTypes}
          description={appearances[type].description}
          icon={getIcon(type)}
          id={type}
          key={type}
          title={appearances[type].title}
        />
      </div>
    ))}
  </div>
);
