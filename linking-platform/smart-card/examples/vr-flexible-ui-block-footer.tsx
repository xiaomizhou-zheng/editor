/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import { VRTestWrapper } from './utils/vr-test';
import { FooterBlock } from '../src/view/FlexibleCard/components/blocks';
import { SmartLinkSize } from '../src/constants';
import {
  blockOverrideCss,
  getCardState,
  makeCustomActionItem,
  makeDeleteActionItem,
  makeEditActionItem,
} from './utils/flexible-ui';
import FlexibleCard from '../src/view/FlexibleCard';
import { ActionItem } from '../src';
import PremiumIcon from '@atlaskit/icon/glyph/premium';

const renderFooter = (size?: SmartLinkSize, actions?: ActionItem[]) => {
  const cardState = getCardState();
  return (
    <FlexibleCard cardState={cardState} ui={{ size }} url="link-url">
      <FooterBlock size={size} actions={actions} />
    </FlexibleCard>
  );
};

const actions: ActionItem[] = [makeDeleteActionItem()];

export default () => (
  <VRTestWrapper title="Flexible UI: FooterBlock">
    <h5>Default</h5>
    {renderFooter()}
    <h5>With two actions</h5>
    {renderFooter(SmartLinkSize.Medium, [
      makeDeleteActionItem(),
      makeEditActionItem(),
    ])}
    <h5>With 3 Custom actions</h5>
    {renderFooter(SmartLinkSize.Medium, [
      makeCustomActionItem(),
      makeDeleteActionItem(),
      makeCustomActionItem({
        icon: <PremiumIcon label="magic" />,
        testId: 'third-action-item',
        content: 'Magic!',
      }),
    ])}
    {Object.values(SmartLinkSize).map((size) => (
      <React.Fragment>
        <h5>Size: {size}</h5>
        {renderFooter(size, actions)}
      </React.Fragment>
    ))}
    <h5>Override CSS</h5>
    <FlexibleCard cardState={getCardState()} url="link-url">
      <FooterBlock overrideCss={blockOverrideCss} />
    </FlexibleCard>
  </VRTestWrapper>
);
