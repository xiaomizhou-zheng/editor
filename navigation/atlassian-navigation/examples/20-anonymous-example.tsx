import React from 'react';

import { AtlassianNavigation, SignIn } from '../src';

import { DefaultCreate } from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { defaultPrimaryItems } from './shared/primary-items';
import { DefaultProductHome } from './shared/product-home';
import { DefaultSearch } from './shared/search';
import { SwitcherPopup } from './shared/switcher-popup';

const SignInExample = () => <SignIn tooltip="Sign in" />;

const AnonymousExample = () => (
  <AtlassianNavigation
    label="site"
    primaryItems={defaultPrimaryItems}
    renderAppSwitcher={SwitcherPopup}
    renderCreate={DefaultCreate}
    renderHelp={HelpPopup}
    renderProductHome={DefaultProductHome}
    renderSignIn={SignInExample}
    renderSearch={DefaultSearch}
  />
);

export default AnonymousExample;
