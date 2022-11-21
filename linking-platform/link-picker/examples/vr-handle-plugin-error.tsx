import React from 'react';

import {
  MockLinkPickerPromisePlugin,
  UnstableMockLinkPickerPlugin,
} from '@atlaskit/link-test-helpers/link-picker';

import { LinkPicker } from '../src';
import { PageWrapper } from '../example-helpers/common';

const plugins = [
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab1',
    tabTitle: 'tab1',
  }),
  new UnstableMockLinkPickerPlugin({
    tabKey: 'tab2',
    tabTitle: 'Unstable',
  }),
];

export default function VrHandlePluginError() {
  return (
    <PageWrapper>
      <LinkPicker plugins={plugins} onSubmit={() => {}} onCancel={() => {}} />
    </PageWrapper>
  );
}
