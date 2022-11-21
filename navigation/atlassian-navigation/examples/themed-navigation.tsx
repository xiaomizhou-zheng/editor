import React from 'react';

import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import {
  AppSwitcher,
  AtlassianNavigation,
  generateTheme,
  ProductHome,
  Settings,
} from '../src';

import { DefaultCreate } from './shared/create';
import { defaultPrimaryItems } from './shared/primary-items';

export const JiraProductHome = () => (
  <ProductHome
    testId="jira-home"
    onClick={console.log}
    icon={JiraIcon}
    logo={JiraLogo}
  />
);

const theme = generateTheme({
  name: 'high-contrast',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  backgroundColor: '#272727',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  highlightColor: '#E94E34',
});

const ThemingExample = () => (
  <AtlassianNavigation
    label="site"
    testId="themed"
    renderAppSwitcher={() => (
      <AppSwitcher testId="app-switcher" tooltip="Switch apps" />
    )}
    primaryItems={defaultPrimaryItems.slice(0, 1)}
    renderCreate={DefaultCreate}
    renderProductHome={JiraProductHome}
    renderSettings={() => <Settings testId="settings" tooltip="Settings" />}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
    theme={theme}
  />
);

export default ThemingExample;
