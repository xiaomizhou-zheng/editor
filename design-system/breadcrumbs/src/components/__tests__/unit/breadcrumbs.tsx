import React, { createRef } from 'react';

import { fireEvent, render } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import Breadcrumbs, { BreadcrumbsItem } from '../../../index';

describe('Breadcrumbs container', () => {
  it('should be able to render a single child', () => {
    const { container } = render(
      <Breadcrumbs onExpand={__noop} testId="bcs">
        <BreadcrumbsItem text="item" />
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(1);
  });

  it('should render multiple children', () => {
    const { getByTestId } = render(
      <Breadcrumbs testId="breadcrumbs-container">
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const container = getByTestId('breadcrumbs-container');
    const links = container.querySelectorAll('a');

    expect(links.length).toEqual(3);
    const anchors = Array.from(links).map((l) => l.text);

    expect(anchors).toEqual(
      expect.arrayContaining(['Item', 'Another item', 'A third item']),
    );
  });

  it('should not count empty children', () => {
    const { container } = render(
      <Breadcrumbs onExpand={__noop} maxItems={3}>
        {null}
        <BreadcrumbsItem text="item" />
        <BreadcrumbsItem text="item" />
        <BreadcrumbsItem text="item" />
        {undefined}
        {false}
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(3);
  });

  it('renders ellipsis for statefull breadcrumbs when there are too many items', () => {
    const { getByTestId } = render(
      <Breadcrumbs testId="breadcrumbs-container" maxItems={2}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const container = getByTestId('breadcrumbs-container');
    const links = container.querySelectorAll('a');

    expect(links.length).toEqual(2);

    const ellipsis = getByTestId('breadcrumbs-container--breadcrumb-ellipsis');
    expect(ellipsis).toBeDefined();
  });

  it('should set the reference on the breadcrumbs', () => {
    const ref = createRef();
    const { getByLabelText } = render(
      <Breadcrumbs testId="breadcrumbs-container" maxItems={2} ref={ref}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const nav = getByLabelText('Breadcrumbs');
    expect(nav).toBe(ref.current);
  });

  it('should accept a function as a reference', () => {
    let ourNode: HTMLElement | undefined;
    const { getByLabelText } = render(
      <Breadcrumbs
        testId="breadcrumbs-container"
        maxItems={2}
        ref={(node: HTMLElement) => {
          ourNode = node;
        }}
      >
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const nav = getByLabelText('Breadcrumbs');
    expect(nav).toBe(ourNode);
  });
});

describe('Controlled breadcrumbs', () => {
  it('render ellipsis', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <Breadcrumbs onExpand={onExpand} maxItems={2} testId="bcs">
        <BreadcrumbsItem text="item 1" />
        <BreadcrumbsItem text="item 2" />
        <BreadcrumbsItem text="item 3" />
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(2);

    const anchors = Array.from(links).map((l) => l.text);

    expect(anchors).toEqual(expect.arrayContaining(['item 1', 'item 3']));
    expect(anchors).not.toEqual(expect.arrayContaining(['item 2']));

    const ellipsis = container.querySelector('button');
    fireEvent.click(ellipsis!);
    expect(onExpand).toHaveBeenCalled();
  });

  it('render ellipsis - before and after', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <Breadcrumbs
        onExpand={onExpand}
        maxItems={4}
        itemsBeforeCollapse={2}
        itemsAfterCollapse={2}
        testId="bcs"
      >
        <BreadcrumbsItem text="item 1" />
        <BreadcrumbsItem text="item 2" />
        <BreadcrumbsItem text="item 3" />
        <BreadcrumbsItem text="item 4" />
        <BreadcrumbsItem text="item 5" />
        <BreadcrumbsItem text="item 6" />
        <BreadcrumbsItem text="item 7" />
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(4);

    const anchors = Array.from(links).map((l) => l.text);

    expect(anchors).toEqual(
      expect.arrayContaining(['item 1', 'item 2', 'item 6', 'item 7']),
    );
    expect(anchors).not.toEqual(
      expect.arrayContaining(['item 3', 'item 4', 'item 5']),
    );
  });

  it('should be wrapped into nav tag', () => {
    const { container } = render(
      <Breadcrumbs testId="breadcrumbs-container">
        <BreadcrumbsItem href="/item" text="Item" />
      </Breadcrumbs>,
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeDefined();
  });

  it('nav wrapper should have a default aria-label when no label passed through props', () => {
    const { container } = render(
      <Breadcrumbs testId="breadcrumbs-container">
        <BreadcrumbsItem href="/item" text="Item" />
      </Breadcrumbs>,
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeDefined();
    expect(nav?.getAttribute('aria-label')).toBe('Breadcrumbs');
  });

  it('received label props should be set as aria-label of nav wrapper', () => {
    const { container } = render(
      <Breadcrumbs testId="breadcrumbs-container" label="Blog Breadcrumbs">
        <BreadcrumbsItem href="/item" text="Item" />
      </Breadcrumbs>,
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeDefined();
    expect(nav?.getAttribute('aria-label')).toBe('Blog Breadcrumbs');
  });

  it('render ellipsis - default aria-label', () => {
    const { getByTestId } = render(
      <Breadcrumbs testId="breadcrumbs-container" maxItems={2}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const ellipsis = getByTestId('breadcrumbs-container--breadcrumb-ellipsis');
    expect(ellipsis).toBeDefined();

    const ariaLabel = ellipsis.getAttribute('aria-label');
    expect(ariaLabel).toBe('Show more breadcrumbs');
  });

  it('render ellipsis - received aria-label', () => {
    const { getByTestId } = render(
      <Breadcrumbs
        testId="breadcrumbs-container"
        maxItems={2}
        ellipsisLabel="Test label"
      >
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const ellipsis = getByTestId('breadcrumbs-container--breadcrumb-ellipsis');
    expect(ellipsis).toBeDefined();

    const ariaLabel = ellipsis.getAttribute('aria-label');
    expect(ariaLabel).toBe('Test label');
  });
});

describe('Focus managment', () => {
  const breadcrumbsFixture = (props: any = {}) => {
    return (
      <Breadcrumbs testId="bcs" maxItems={2} {...props}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>
    );
  };

  it('should focus first revealed item, if ellipsis was focused', () => {
    const { getByTestId, getByText } = render(breadcrumbsFixture());

    const ellipsis = getByTestId('bcs--breadcrumb-ellipsis');
    ellipsis.focus();

    fireEvent.click(ellipsis);
    const revealedItem = getByText('Another item').parentElement;

    expect(revealedItem).toHaveFocus();
  });

  it('should not focus first revealed item, if ellipsis was not focused', () => {
    const { getByTestId, getByText } = render(breadcrumbsFixture());

    const ellipsis = getByTestId('bcs--breadcrumb-ellipsis');

    fireEvent.click(ellipsis);
    const revealedItem = getByText('Another item').parentElement;

    expect(revealedItem).not.toHaveFocus();
  });

  describe('should not focus when there is no one of controlling prop', () => {
    it('without onExpand', () => {
      const { getByTestId, getByText, rerender } = render(
        breadcrumbsFixture({ isExpanded: false }),
      );

      const ellipsis = getByTestId('bcs--breadcrumb-ellipsis');
      ellipsis.focus();
      fireEvent.click(ellipsis);

      rerender(breadcrumbsFixture({ isExpanded: true }));

      const revealedItem = getByText('Another item').parentElement;
      expect(revealedItem).not.toHaveFocus();
    });
  });

  it('should focus first revealed item, when have both isExpanded and onExpand props', () => {
    const mockOnExpand = jest.fn();

    const { getByTestId, getByText, rerender } = render(
      breadcrumbsFixture({ isExpanded: false, onExpand: mockOnExpand }),
    );

    const ellipsis = getByTestId('bcs--breadcrumb-ellipsis');
    ellipsis.focus();
    fireEvent.click(ellipsis);

    rerender(breadcrumbsFixture({ isExpanded: true, onExpand: mockOnExpand }));

    const revealedItem = getByText('Another item').parentElement;
    expect(revealedItem).toHaveFocus();
  });

  it('should focus the wrapper when there are no intractive elements', () => {
    const NonInteractiveComponent = ({ children }: any) => (
      <div>{children}</div>
    );

    const { getByLabelText, getByTestId } = render(
      <Breadcrumbs testId="bcs" maxItems={2}>
        <BreadcrumbsItem
          href="/item"
          text="Item"
          component={NonInteractiveComponent}
        />
        <BreadcrumbsItem
          href="/item"
          text="Another item"
          component={NonInteractiveComponent}
        />
        <BreadcrumbsItem
          href="/item"
          text="A third item"
          component={NonInteractiveComponent}
        />
      </Breadcrumbs>,
    );

    const wrapper = getByLabelText('Breadcrumbs');
    const ellipsis = getByTestId('bcs--breadcrumb-ellipsis');
    ellipsis.focus();
    fireEvent.click(ellipsis);

    expect(wrapper).toHaveFocus();
  });

  it('should focus the first breadcrumb item when there are no intractive elements appeared', () => {
    const NonInteractiveComponent = ({ children }: any) => (
      <div>{children}</div>
    );

    const { getByText, getByTestId } = render(
      <Breadcrumbs testId="bcs" maxItems={2}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem
          href="/item"
          text="Another item"
          component={NonInteractiveComponent}
        />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const firstBreadcrumbItem = getByText('Item').parentElement;
    const ellipsis = getByTestId('bcs--breadcrumb-ellipsis');
    ellipsis.focus();
    fireEvent.click(ellipsis);

    expect(firstBreadcrumbItem).toHaveFocus();
  });
});
