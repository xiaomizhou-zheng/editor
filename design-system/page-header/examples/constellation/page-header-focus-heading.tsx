import React, { useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button from '@atlaskit/button/standard-button';
import __noop from '@atlaskit/ds-lib/noop';

import PageHeader from '../../src';

const breadcrumbs = (
  <Breadcrumbs onExpand={__noop}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </Breadcrumbs>
);

const PageHeaderFocusHeadingExample = () => {
  const [ref, setRef] = useState<HTMLElement>();

  const onClick = () => {
    if (ref) {
      ref.focus();
    }
  };

  const innerRef = (element: HTMLElement) => {
    setRef(element);
  };

  return (
    <div>
      <Button onClick={onClick}>Focus on heading</Button>
      <PageHeader breadcrumbs={breadcrumbs} innerRef={innerRef}>
        Title describing the content
      </PageHeader>
    </div>
  );
};

export default PageHeaderFocusHeadingExample;
