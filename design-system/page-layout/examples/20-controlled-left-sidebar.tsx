/** @jsx jsx */

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { Content, LeftSidebar, Main, PageLayout, TopNavigation } from '../src';

import { SlotLabel, SlotWrapper } from './common';

const BasicGrid = () => {
  return (
    <PageLayout>
      <TopNavigation
        testId="topNavigation"
        id="product-navigation"
        skipLinkTitle="Product Navigation"
        height={60}
        isFixed={false}
      >
        <SlotWrapper borderColor={token('color.border.accent.blue', 'blue')}>
          <SlotLabel>Product Navigation</SlotLabel>
        </SlotWrapper>
      </TopNavigation>
      <Content testId="content">
        <LeftSidebar
          testId="leftSidebar"
          id="space-navigation"
          skipLinkTitle="Space Navigation"
          width={350}
          collapsedState="collapsed"
        >
          <SlotWrapper hasExtraPadding hasHorizontalScrollbar={false}>
            <SlotLabel isSmall>Space Navigation</SlotLabel>
          </SlotWrapper>
        </LeftSidebar>
        <Main testId="main" id="main" skipLinkTitle="Main Content">
          <SlotWrapper hasHorizontalScrollbar={false} minHeight={400}>
            <SlotLabel isSmall>Main Content</SlotLabel>
            <p>
              When you set <b>collapsedState</b> to <b>expanded</b> the
              LeftSidebar will always mount expanded, and when you set{' '}
              <b>collapsedState</b> to <b>collapsed</b> the LeftSidebar will
              always mount collapsed.
              <br />
              Try expanding the LeftSidebar then refreshing the page, the
              LeftSidebar will mount in a <b>collapsed</b> state.
            </p>
            <p>
              When you set <b>width</b> the LeftSidebar will always mount with
              the value passed. You can still resize the LeftSidebar but it will
              ignore what width value exists in localStorage when mounting.
              <br />
              Try expanding and then resizing the LeftSidebar, then refresh the
              page and expand the LeftSidebar again, the LeftSidebar will mount
              with a width of <b>350</b>.
            </p>
          </SlotWrapper>
        </Main>
      </Content>
    </PageLayout>
  );
};

export default BasicGrid;
