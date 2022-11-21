/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
  Content,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  TopNavigation,
} from '../src';

import { ScrollableContent, SlotLabel } from './common';

const topNavigationWrapperStyles = css({
  boxSizing: 'border-box',
  padding: '1rem',
  backgroundColor: token('color.background.neutral.subtle', '#FFF'),
  borderBottom: `1px solid ${token('color.border', 'lightgray')}`,
});

const leftSidebarWrapperStyles = css({ padding: '0 20px' });

const WithStickyElement = () => {
  return (
    <PageLayout>
      <TopNavigation testId="topNavigation" height={60}>
        <div css={topNavigationWrapperStyles}>
          <SlotLabel>TopNavigation</SlotLabel>
        </div>
      </TopNavigation>
      <Content testId="content">
        <LeftSidebarWithoutResize testId="leftSidebar" width={250}>
          <div css={leftSidebarWrapperStyles}>
            <SlotLabel>LeftSidebar</SlotLabel>
          </div>
        </LeftSidebarWithoutResize>
        <Main testId="main">
          <SlotLabel>Main</SlotLabel>
          <ScrollableContent shouldHighlightNth />
        </Main>
      </Content>
    </PageLayout>
  );
};

export default WithStickyElement;
