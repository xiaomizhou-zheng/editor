/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/react';

import { N10, N500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export interface SideNavigationProps {
  /**
   *  Describes the specific role of this navigation component for users viewing the page with a screen reader.
   *  Differentiates from other navigation components on a page.
   */
  label: string;

  /**
   * Child navigation elements.
   * You'll want to compose children from [navigation header](/packages/navigation/side-navigation/docs/navigation-header),
   * [navigation content](/packages/navigation/side-navigation/docs/navigation-content) or [nestable navigation content](/packages/navigation/side-navigation/docs/nestable-navigation-content),
   * and [navigation footer](/packages/navigation/side-navigation/docs/navigation-footer).
   */
  children: JSX.Element[] | JSX.Element;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const sideNavStyles = css({
  display: 'flex',
  width: '100%',
  minWidth: gridSize() * 30,
  height: '100%',
  position: 'relative',
  flexDirection: 'column',
  backgroundColor: token('elevation.surface', N10),
  color: token('color.text.subtle', N500),
  overflow: 'hidden',
});

/**
 * __Side navigation__
 *
 * A highly composable side navigation component that supports nested views.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 * - [Usage](https://atlassian.design/components/side-navigation/usage)
 */
const SideNavigation = forwardRef<HTMLElement, SideNavigationProps>(
  (props: SideNavigationProps, ref) => {
    const { children, testId, label } = props;
    return (
      <nav
        ref={ref}
        data-testid={testId}
        aria-label={label}
        css={sideNavStyles}
      >
        {children}
      </nav>
    );
  },
);

export default SideNavigation;
