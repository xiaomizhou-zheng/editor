import React from 'react';

import { HashRouter, Link, Route, Switch } from 'react-router-dom';

import { token } from '@atlaskit/tokens';

import Pagination from '../src';

const PAGES = [
  {
    href: '/',
    label: '1',
  },
  {
    href: '/about',
    label: '2',
  },
  {
    href: '/contact',
    label: '3',
  },
];

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <PaginationWithSelectPage pageSelected={0} />
  </div>
);
const About = () => (
  <div>
    <h1>About page</h1>
    <PaginationWithSelectPage pageSelected={1} />
  </div>
);
const Contact = () => (
  <div>
    <h1>Contact page</h1>
    <PaginationWithSelectPage pageSelected={2} />
  </div>
);

interface LinkProps {
  isDisabled: boolean;
  page: any;
  pages: any[];
  selectedIndex: number;
  style: object;
}

function renderLink(pageType: string, selectedIndex: number) {
  return function PageItem({ isDisabled, page, pages, ...rest }: LinkProps) {
    let href;
    if (pageType === 'page') {
      href = page.href;
    } else if (pageType === 'previous') {
      href = selectedIndex > 1 ? pages[selectedIndex - 1].href : '';
    } else {
      href =
        selectedIndex < pages.length - 1 ? pages[selectedIndex + 1].href : '';
    }
    // We need this styling on the navigator since when using icons as children we need extra padding
    const style =
      pageType === 'page'
        ? undefined
        : {
            paddingLeft: token('spacing.scale.050', '4px'),
            paddingRight: token('spacing.scale.050', '4px'),
          };
    return isDisabled ? (
      <div {...rest} style={style} />
    ) : (
      <Link {...rest} style={style} to={href} />
    );
  };
}

const PaginationWithSelectPage = ({
  pageSelected,
}: {
  pageSelected: number;
}) => (
  <div style={{ marginTop: token('spacing.scale.300', '24px') }}>
    <Pagination
      testId="pagination"
      style={{ marginTop: '24px' }}
      getPageLabel={(page: any) =>
        typeof page === 'object' ? page.label : page
      }
      selectedIndex={pageSelected}
      pages={PAGES}
      components={{
        Page: renderLink('page', pageSelected),
        Previous: renderLink('previous', pageSelected),
        Next: renderLink('next', pageSelected),
      }}
    />
  </div>
);

export default function WithReactRouterLink() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/" isExact component={Dashboard} />
      </Switch>
    </HashRouter>
  );
}
