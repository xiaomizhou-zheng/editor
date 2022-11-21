/** @jsx jsx */
import { SyntheticEvent, useState } from 'react';

import { css, jsx } from '@emotion/react';

import noop from '@atlaskit/ds-lib/noop';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { RadioGroup } from '@atlaskit/radio';
import Spinner from '@atlaskit/spinner';
import { G400, R400, Y200 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';
import { AppearanceArray, AppearanceTypes } from '../src/types';

const boldAppearanceNames = AppearanceArray.filter((val) => val !== 'normal');

type boldAppearanceItem = {
  name: string;
  value: AppearanceTypes;
  label: string;
};

const boldAppearanceItems: Array<boldAppearanceItem> = boldAppearanceNames.map(
  (val) => ({
    name: val,
    value: val,
    label: val,
  }),
);

const iconStyles = css({
  width: gridSize() * 3,
  height: gridSize() * 3,
});

const ConnectionDemo = () => {
  const [appearance, setAppearance] = useState<AppearanceTypes>(
    boldAppearanceNames[0],
  );

  const getTitle = (): string => {
    switch (appearance) {
      case 'error':
        return 'We are having issues';
      case 'info':
        return 'Connecting...';
      case 'success':
        return 'Connected';
      case 'warning':
        return 'Trying again...';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (appearance) {
      case 'error':
        return (
          <ErrorIcon
            label="Error"
            secondaryColor={token('color.background.danger.bold', R400)}
          />
        );
      case 'info':
        // We wrap the Spinner in a div the same height as a standard Icon, to avoid
        // the flag height jumping when Flag.appearance is changed.
        return (
          <div css={iconStyles}>
            <Spinner size="small" appearance="invert" />
          </div>
        );
      case 'success':
        return (
          <SuccessIcon
            label="Success"
            secondaryColor={token('color.background.success.bold', G400)}
          />
        );
      case 'warning':
        return (
          <WarningIcon
            label="Warning"
            secondaryColor={token('color.background.warning.bold', Y200)}
          />
        );
      default:
        return (
          <SuccessIcon
            label=""
            secondaryColor={token('color.background.success.bold', G400)}
          />
        );
    }
  };

  const getDescription = () => {
    if (appearance === 'error') {
      return 'We cannot log in at the moment, please try again soon.';
    }
    return undefined;
  };

  const getActions = () => {
    if (appearance === 'warning') {
      return [{ content: 'Good luck!', onClick: noop }];
    }
    return undefined;
  };

  return (
    <div>
      <FlagGroup>
        <Flag
          appearance={appearance}
          icon={getIcon()}
          title={getTitle()}
          description={getDescription()}
          actions={getActions()}
          id="fake-flag"
        />
      </FlagGroup>
      <p>This story shows the transition between various flag appearances.</p>
      <RadioGroup
        options={boldAppearanceItems}
        onChange={(e: SyntheticEvent<HTMLInputElement>) => {
          setAppearance(e.currentTarget.value as AppearanceTypes);
        }}
        defaultValue={boldAppearanceNames[0]}
      />
    </div>
  );
};

export default ConnectionDemo;
