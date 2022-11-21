jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.mock('../../../utils/analytics/analytics');
jest.mock('@atlaskit/outbound-auth-flow-client', () => {
  const { AuthError } = jest.requireActual(
    '@atlaskit/outbound-auth-flow-client',
  );
  return {
    auth: jest.fn(),
    AuthError,
  };
});

import '../../__mocks__/intersection-observer.mock';
import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';
import * as analyticsEvents from '../../../utils/analytics';
import { auth, AuthError } from '@atlaskit/outbound-auth-flow-client';
import { CardClient } from '@atlaskit/link-provider';
import React from 'react';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { render, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

describe('smart-card: forbidden analytics', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.forbidden);
    mockClient = new (fakeFactory(mockFetch))();
    mockWindowOpen = jest.fn();
    /// @ts-ignore
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('forbidden', () => {
    it('should fire analytics events when attempting to connect with an alternate account succeeds', async () => {
      const mockUrl = 'https://this.is.the.fourth.url';
      const { getByTestId, container } = render(
        <IntlProvider locale="en">
          <Provider client={mockClient}>
            <Card testId="forbiddenCard1" appearance="inline" url={mockUrl} />
          </Provider>
        </IntlProvider>,
      );
      const forbiddenLink = await waitFor(
        () => getByTestId('forbiddenCard1-forbidden-view'),
        {
          timeout: 10000,
        },
      );
      const forbiddenLinkButton = container.querySelector('[type="button"]');
      expect(forbiddenLink).toBeTruthy();
      expect(forbiddenLinkButton).toBeTruthy();
      expect(forbiddenLinkButton!.innerHTML).toContain('Try another');
      // Mock out auth flow, & click connect.
      asMockFunction(auth).mockImplementationOnce(async () => {});
      fireEvent.click(forbiddenLinkButton!);

      mockFetch.mockImplementationOnce(async () => mocks.success);
      const resolvedView = await waitFor(
        () => getByTestId('forbiddenCard1-resolved-view'),
        {
          timeout: 10000,
        },
      );
      expect(resolvedView).toBeTruthy();
      expect(analyticsEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(analyticsEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(
        1,
      );
      expect(analyticsEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(analyticsEvents.trackAppAccountConnected).toHaveBeenCalledTimes(1);
      expect(analyticsEvents.connectSucceededEvent).toHaveBeenCalledTimes(1);
      expect(analyticsEvents.fireSmartLinkEvent).toBeCalledWith(
        {
          action: 'unresolved',
          attributes: {
            componentName: 'smart-cards',
            display: 'inline',
            id: expect.any(String),
            extensionKey: 'object-provider',
            definitionId: 'd1',
          },
        },
        expect.any(Function),
      );
    });

    it('should fire analytics events when attempting to connect with an alternate account fails', async () => {
      const mockUrl = 'https://this.is.the.fifth.url';
      const { getByTestId, container } = render(
        <IntlProvider locale="en">
          <Provider client={mockClient}>
            <Card testId="forbiddenCard2" appearance="inline" url={mockUrl} />
          </Provider>
        </IntlProvider>,
      );
      const forbiddenLink = await waitFor(
        () => getByTestId('forbiddenCard2-forbidden-view'),
        {
          timeout: 10000,
        },
      );
      const forbiddenLinkButton = container.querySelector('[type="button"]');
      expect(forbiddenLink).toBeTruthy();
      expect(forbiddenLinkButton).toBeTruthy();
      expect(forbiddenLinkButton!.innerHTML).toContain('Try another');
      // Mock out auth flow, & click connect.
      asMockFunction(auth).mockImplementationOnce(() =>
        Promise.reject(new AuthError('')),
      );
      fireEvent.click(forbiddenLinkButton!);

      mockFetch.mockImplementationOnce(async () => mocks.success);
      const unresolvedView = await waitFor(
        () => getByTestId('forbiddenCard2-resolved-view'),
        {
          timeout: 10000,
        },
      );
      expect(unresolvedView).toBeTruthy();
      expect(analyticsEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(analyticsEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(
        1,
      );
      expect(analyticsEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(analyticsEvents.connectFailedEvent).toHaveBeenCalledTimes(1);
      expect(analyticsEvents.connectFailedEvent).toHaveBeenCalledWith({
        id: expect.any(String),
        extensionKey: 'object-provider',
        definitionId: 'd1',
      });
    });
  });
});
