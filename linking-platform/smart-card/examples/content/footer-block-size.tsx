import React from 'react';
import { ActionItem, ActionName, FooterBlock, SmartLinkSize } from '../../src';
import ExampleContainer from './example-container';

const actions = [
  { name: ActionName.DeleteAction, onClick: () => {}, hideContent: true },
] as ActionItem[];

export default () => (
  <ExampleContainer>
    <FooterBlock size={SmartLinkSize.Small} actions={actions} />
    <br />
    <FooterBlock size={SmartLinkSize.Medium} actions={actions} />
    <br />
    <FooterBlock size={SmartLinkSize.Large} actions={actions} />
    <br />
    <FooterBlock size={SmartLinkSize.XLarge} actions={actions} />
  </ExampleContainer>
);
