import React from 'react';

import { VRTestWrapper } from './utils/vr-test';
import { blockOverrideCss, getCardState } from './utils/flexible-ui';
import FlexibleCard from '../src/view/FlexibleCard';
import { SnippetBlock } from '../src/index';

const cardState = getCardState({
  summary:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id feugiat elit, ut gravida felis. Phasellus arcu velit, tincidunt id rhoncus sit amet, vehicula vel ligula. Nullam nec vestibulum velit, eu tempus elit. Nunc sodales ultricies metus eget facilisis. Phasellus a arcu tortor. In porttitor metus ac ex ornare, quis efficitur est laoreet. Fusce elit elit, finibus vulputate accumsan ut, porttitor eu libero. Mauris eget hendrerit risus, vitae mollis dui. Sed pretium nisi tellus, quis bibendum est vestibulum ac.',
});

export default () => (
  <VRTestWrapper title="Flexible UI: SnippetBlock">
    <h5>Default</h5>
    <FlexibleCard cardState={cardState} url="link-url">
      <SnippetBlock />
    </FlexibleCard>
    <h5>Single line</h5>
    <FlexibleCard cardState={cardState} url="link-url">
      <SnippetBlock maxLines={1} />
    </FlexibleCard>
    <h5>Override CSS</h5>
    <FlexibleCard cardState={cardState} url="link-url">
      <SnippetBlock overrideCss={blockOverrideCss} />
    </FlexibleCard>
  </VRTestWrapper>
);
