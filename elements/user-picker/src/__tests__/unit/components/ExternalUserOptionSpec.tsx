import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ExternalUserOption } from '../../../components/ExternalUserOption/main';
import { ExternalUser, UserSource, UserSourceResult } from '../../../types';
import { ExusUserSourceProvider } from '../../../clients/UserSourceProvider';
import { createAndFireEventInElementsChannel } from '../../../analytics';
import { IntlProvider } from 'react-intl-next';

jest.mock('../../../../src/analytics', () => ({
  __esModule: true,
  ...(jest.requireActual('../../../../src/analytics') as object),
  createAndFireEventInElementsChannel: jest.fn().mockReturnValue(jest.fn()),
}));

describe('ExternalUserOption', () => {
  const source = 'google';
  const user: ExternalUser = {
    id: 'abc123abc123abc123abc123',
    name: 'Jace Beleren',
    email: 'jbeleren@email.com',
    avatarUrl: 'http://avatars.atlassian.com/jace.png',
    lozenge: 'WORKSPACE',
    isExternal: true,
    sources: [source] as UserSource[],
  };

  const userRequiresHydration: ExternalUser = {
    ...user,
    requiresSourceHydration: true,
  };

  // Check for text within some HTML that ignores it being split across nodes
  // eg. <div>jbeleren<span>@email.com</span></div>
  const hasTextIgnoringHtml = (matchingText: string) => (
    content: string,
    node: Element | null,
  ) => {
    const hasText = (node: Element | null) =>
      node?.textContent === matchingText;
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node!.children).every(
      (child) => !hasText(child),
    );

    return nodeHasText && childrenDontHaveText;
  };

  it('should name, email and avatar', () => {
    const { getByText, getByAltText } = render(
      <IntlProvider messages={{}} locale="en">
        <ExternalUserOption user={user} status="approved" isSelected={false} />
      </IntlProvider>,
    );
    expect(getByText(hasTextIgnoringHtml(user.email!))).toBeTruthy();
    expect(getByText(user.name)).toBeTruthy();
    expect(getByAltText(user.name)).toBeTruthy();
  });

  it('should render a tooltip containing the user sources', async () => {
    expect.assertions(4);
    const { getByTestId, getByRole, findByRole } = render(
      <IntlProvider messages={{}} locale="en">
        <ExternalUserOption user={user} status="approved" isSelected={false} />
      </IntlProvider>,
    );
    // Sources info icon is visible
    expect(getByTestId('source-icon')).toBeTruthy();
    // Hover over tooltip
    fireEvent.mouseOver(getByTestId('source-icon'));
    await findByRole('tooltip');
    const tooltip = getByRole('tooltip');
    // Tooltip has single source displayed
    expect(tooltip).toHaveTextContent('Found in:');
    expect(tooltip).toHaveTextContent('Google');
    expect(tooltip).not.toHaveTextContent('GitHub');
  });

  it('should render tooltip elements and merge async sources into the tooltip contents', async () => {
    expect.assertions(3);
    const mockFetch = jest.fn(
      () =>
        new Promise<UserSourceResult[]>((resolve) => {
          resolve([
            {
              sourceId: '1234',
              sourceType: 'github',
            },
          ]);
        }),
    );
    const { getByTestId, getByRole, findByRole } = render(
      <IntlProvider messages={{}} locale="en">
        <ExusUserSourceProvider fetchUserSource={mockFetch}>
          <ExternalUserOption
            user={userRequiresHydration}
            status="approved"
            isSelected={false}
          />
        </ExusUserSourceProvider>
      </IntlProvider>,
    );
    // Hover over tooltip
    fireEvent.mouseOver(getByTestId('source-icon'));
    await findByRole('tooltip');
    const tooltip = getByRole('tooltip');
    // Tooltip has expected sources displayed
    expect(tooltip).toHaveTextContent('Found in:');
    expect(tooltip).toHaveTextContent('Google');
    expect(tooltip).toHaveTextContent('GitHub');
  });

  it('should not render tooltip elements when sources collection is empty and user is not external', () => {
    const userWithEmptySources = {
      ...user,
      isExternal: false,
      sources: [],
    };
    const { queryByTestId } = render(
      <IntlProvider messages={{}} locale="en">
        <ExternalUserOption
          user={userWithEmptySources}
          status="approved"
          isSelected={false}
        />
      </IntlProvider>,
    );
    // Sources info icon is not visible
    expect(queryByTestId('source-icon')).not.toBeTruthy();
  });

  it('should render tooltip elements when sources collection is empty and user is external', () => {
    const userWithEmptySources = {
      ...user,
      sources: [],
    };
    const { queryByTestId } = render(
      <IntlProvider messages={{}} locale="en">
        <ExternalUserOption
          user={userWithEmptySources}
          status="approved"
          isSelected={false}
        />
      </IntlProvider>,
    );
    // Sources info icon is visible
    expect(queryByTestId('source-icon')).toBeTruthy();
  });

  it('should not render an error in the tooltip if the fetch call fails', async () => {
    const fetchSpy = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error('Failed to fetch')));
    // Empty sources so that we show the error
    const userWithEmptySources = {
      ...userRequiresHydration,
      sources: [],
    };

    expect.assertions(2);
    const { getByTestId, getByRole, findByRole } = render(
      <ExusUserSourceProvider fetchUserSource={fetchSpy}>
        <IntlProvider messages={{}} locale="en">
          <ExternalUserOption
            user={userWithEmptySources}
            status="approved"
            isSelected={false}
          />
        </IntlProvider>
      </ExusUserSourceProvider>,
    );
    // Sources info icon is visible
    expect(getByTestId('source-icon')).toBeTruthy();
    // Hover over tooltip
    fireEvent.mouseOver(getByTestId('source-icon'));
    await findByRole('tooltip');
    const tooltip = getByRole('tooltip');
    // Tooltip has error
    expect(tooltip).toHaveTextContent("We can't connect you right now.");
  });

  it('should not call fetch sources if user does not require source hydration', async () => {
    const mockFetch = jest.fn(
      () =>
        new Promise<UserSourceResult[]>((resolve) => {
          resolve([
            {
              sourceId: '1234',
              sourceType: 'github',
            },
          ]);
        }),
    );

    const userNoHydration: ExternalUser = {
      ...user,
      requiresSourceHydration: false,
    };

    expect.assertions(5);
    const { getByTestId, getByRole, findByRole } = render(
      <ExusUserSourceProvider fetchUserSource={mockFetch}>
        <IntlProvider messages={{}} locale="en">
          <ExternalUserOption
            user={userNoHydration}
            status="approved"
            isSelected={false}
          />
        </IntlProvider>
      </ExusUserSourceProvider>,
    );
    // Sources info icon is visible
    expect(getByTestId('source-icon')).toBeTruthy();
    // Hover over tooltip
    fireEvent.mouseOver(getByTestId('source-icon'));
    await findByRole('tooltip');
    const tooltip = getByRole('tooltip');

    // Tooltip has single source displayed
    expect(tooltip).toHaveTextContent('Found in:');
    expect(tooltip).toHaveTextContent('Google');
    expect(tooltip).not.toHaveTextContent('GitHub');

    // fetch was not called
    expect(mockFetch).toBeCalledTimes(0);
  });

  describe('Analytics Events', () => {
    it('should fire an event when the sources tooltip is viewed', async () => {
      expect.assertions(2);
      const { getByTestId, findByRole } = render(
        <IntlProvider messages={{}} locale="en">
          <ExternalUserOption
            user={user}
            status="approved"
            isSelected={false}
          />
        </IntlProvider>,
      );
      // Sources info icon is visible
      expect(getByTestId('source-icon')).toBeTruthy();
      // Hover over tooltip
      fireEvent.mouseOver(getByTestId('source-icon'));
      await findByRole('tooltip');
      // Event is fired when tooltip is displayed
      expect(createAndFireEventInElementsChannel).toHaveBeenCalledWith({
        action: 'displayed',
        actionSubject: 'userInfo',
        attributes: {
          accountId: 'abc123abc123abc123abc123',
          packageName: '@atlaskit/user-picker',
          packageVersion: '999.9.9',
          sources: ['google'],
        },
        eventType: 'ui',
      });
    });

    it('should not include PII when the sources tooltip is viewed', async () => {
      expect.assertions(2);
      const { getByTestId, findByRole } = render(
        <IntlProvider messages={{}} locale="en">
          <ExternalUserOption
            user={{ ...user, id: 'test@atlassian.com' }}
            status="approved"
            isSelected={false}
          />
        </IntlProvider>,
      );
      // Sources info icon is visible
      expect(getByTestId('source-icon')).toBeTruthy();
      // Hover over tooltip
      fireEvent.mouseOver(getByTestId('source-icon'));
      await findByRole('tooltip');
      // Event is fired when tooltip is displayed
      expect(createAndFireEventInElementsChannel).toHaveBeenCalledWith({
        action: 'displayed',
        actionSubject: 'userInfo',
        attributes: {
          accountId: null,
          packageName: '@atlaskit/user-picker',
          packageVersion: '999.9.9',
          sources: ['google'],
        },
        eventType: 'ui',
      });
    });
  });
});
