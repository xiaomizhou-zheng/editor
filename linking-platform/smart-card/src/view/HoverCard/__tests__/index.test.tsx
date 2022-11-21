jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../../utils/analytics/analytics');
jest.mock('react-render-image', () => ({ src, errored, onError }: any) => {
  switch (src) {
    case 'src-error':
      onError && onError();
      return errored;
    default:
      return null;
  }
});

import '../../__mocks__/intersection-observer.mock';
import React from 'react';
import { fireEvent, render, cleanup, waitFor } from '@testing-library/react';
import { fakeFactory } from '../../../utils/mocks';
import { CardClient } from '@atlaskit/link-provider';
import { Provider } from '../../..';
import * as analytics from '../../../utils/analytics/analytics';
import { Card } from '../../Card';
import { IntlProvider } from 'react-intl-next';
import {
  mockConfluenceResponse,
  mockJiraResponse,
  mockIframelyResponse,
  mockBaseResponseWithPreview,
  mockBaseResponseWithErrorPreview,
  mockBaseResponseWithDownload,
  mockSSRResponse,
} from './__mocks__/mocks';
import * as HoverCardComponent from '../components/HoverCardComponent';

describe('HoverCard', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockUrl: string;

  const setup = async (mock: any = mockConfluenceResponse) => {
    mockFetch = jest.fn(() => Promise.resolve(mock));
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'https://some.url';

    const { queryByTestId, findByTestId } = render(
      <IntlProvider locale="en">
        <Provider client={mockClient}>
          <Card appearance="inline" url={mockUrl} showHoverPreview={true} />
        </Provider>
      </IntlProvider>,
    );

    const element = await findByTestId('inline-card-resolved-view');
    jest.useFakeTimers();
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('April 1, 2022 00:00:00').getTime());

    fireEvent.mouseEnter(element);

    return { findByTestId, queryByTestId, element };
  };

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    cleanup();
  });

  it('renders hover card', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const hoverCard = await findByTestId('hover-card');

    expect(hoverCard).toBeTruthy();
  });

  it('renders hover card blocks', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const titleBlock = await findByTestId('smart-block-title-resolved-view');
    await findByTestId('smart-block-metadata-resolved-view');
    const snippetBlock = await findByTestId(
      'smart-block-snippet-resolved-view',
    );
    const footerBlock = await findByTestId('smart-footer-block-resolved-view');
    //trim because the icons are causing new lines in the textContent
    expect(titleBlock.textContent?.trim()).toBe('I love cheese');
    expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
    expect(footerBlock.textContent?.trim()).toBe('ConfluenceCommentPreview');
  });

  it('should render preview instead of snippet when preview data is available', async () => {
    const { findByTestId, queryByTestId } = await setup(
      mockBaseResponseWithPreview,
    );
    jest.runAllTimers();
    await findByTestId('smart-block-title-resolved-view');
    await findByTestId('smart-block-preview-resolved-view');

    expect(queryByTestId('smart-block-snippet-resolved-view')).toBeNull();
  });

  it('should fallback to rendering snippet if preview data is available but fails to load', async () => {
    const { findByTestId, queryByTestId } = await setup(
      mockBaseResponseWithErrorPreview,
    );
    jest.runAllTimers();
    await findByTestId('smart-block-title-resolved-view');
    fireEvent.transitionEnd(
      await findByTestId('smart-block-preview-resolved-view'),
    );
    await findByTestId('smart-block-snippet-resolved-view');

    expect(queryByTestId('smart-block-preview-resolved-view')).toBeNull();
  });

  describe('metadata', () => {
    it('renders correctly for confluence links', async () => {
      const { findByTestId } = await setup();
      jest.runAllTimers();
      await findByTestId('authorgroup-metadata-element');
      const createdBy = await findByTestId('createdby-metadata-element');
      const commentCount = await findByTestId('commentcount-metadata-element');
      const reactCount = await findByTestId('reactcount-metadata-element');

      expect(createdBy.textContent).toBe('Created by Michael Schrute');
      expect(commentCount.textContent).toBe('4');
      expect(reactCount.textContent).toBe('8');
    });

    it('renders correctly for jira links', async () => {
      const { findByTestId } = await setup(mockJiraResponse);
      jest.runAllTimers();
      await findByTestId('authorgroup-metadata-element');
      const priority = await findByTestId('priority-metadata-element');
      const state = await findByTestId('state-metadata-element');

      expect(priority.textContent).toBe('Major');
      expect(state.textContent).toBe('Done');
    });

    it('renders correctly for other providers', async () => {
      const { findByTestId } = await setup(mockIframelyResponse);
      jest.runAllTimers();
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      const modifiedOn = await findByTestId('modifiedon-metadata-element');
      const createdBy = await findByTestId('createdby-metadata-element');

      expect(titleBlock.textContent?.trim()).toBe('I love cheese');
      expect(modifiedOn.textContent).toBe('Updated on Jan 1, 2022');
      expect(createdBy.textContent).toBe('Created by Michael Schrute');
    });
  });

  describe('when mouse moves over the child', () => {
    it('should wait a default delay before showing', async () => {
      const { queryByTestId } = await setup();

      // Delay not completed yet
      jest.advanceTimersByTime(299);

      expect(queryByTestId('hover-card')).toBeNull();

      // Delay completed
      jest.advanceTimersByTime(1);

      expect(queryByTestId('hover-card')).not.toBeNull();
    });

    it('should wait a default delay before hiding', async () => {
      const { queryByTestId, element } = await setup();
      jest.runAllTimers();
      fireEvent.mouseLeave(element);

      // Delay not completed yet
      jest.advanceTimersByTime(299);

      expect(queryByTestId('hover-card')).not.toBeNull();

      // Delay completed
      jest.advanceTimersByTime(1);

      expect(queryByTestId('hover-card')).toBeNull();
    });
  });

  it('should stay shown if theres a mouseEnter before the delay elapses', async () => {
    const { queryByTestId, element } = await setup();
    jest.runAllTimers();
    fireEvent.mouseLeave(element);

    // Delay not completed yet
    jest.advanceTimersByTime(299);
    expect(queryByTestId('hover-card')).not.toBeNull();

    fireEvent.mouseEnter(element);

    // Delay completed
    jest.advanceTimersByTime(1);

    expect(queryByTestId('hover-card')).not.toBeNull();
  });

  it('should stay hidden if theres a mouseLeave before the delay elapses', async () => {
    const { queryByTestId, element } = await setup();

    // Delay not completed yet
    jest.advanceTimersByTime(299);

    expect(queryByTestId('hover-card')).toBeNull();
    fireEvent.mouseLeave(element);

    // Delay completed
    jest.advanceTimersByTime(1);

    expect(queryByTestId('hover-card')).toBeNull();
  });

  it('should stay shown if mouse moves over the hover card', async () => {
    const { findByTestId, queryByTestId, element } = await setup();

    jest.runAllTimers();

    const hoverCard = await findByTestId('smart-links-container');
    fireEvent.mouseLeave(element);
    fireEvent.mouseEnter(hoverCard);

    jest.runAllTimers();

    expect(queryByTestId('hover-card')).not.toBeNull();
  });

  it('should hide if mouse moves leaves the hover card', async () => {
    const { findByTestId, queryByTestId, element } = await setup();

    jest.runAllTimers();

    const hoverCard = await findByTestId('smart-links-container');
    fireEvent.mouseLeave(element);
    fireEvent.mouseEnter(hoverCard);
    fireEvent.mouseLeave(hoverCard);

    jest.runAllTimers();

    expect(queryByTestId('hover-card')).toBeNull();
  });

  it('should hide after pressing escape', async () => {
    const { queryByTestId } = await setup();

    jest.runAllTimers();

    fireEvent.keyDown(document, { key: 'Escape', code: 27 });

    expect(queryByTestId('hover-card')).toBeNull();
  });

  it('should render smartlink actions', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const commentButton = await findByTestId('comment');
    const previewButton = await findByTestId('preview-content');

    expect(commentButton.textContent).toBe('Comment');
    expect(previewButton.textContent).toBe('Preview');
  });

  it('should open preview modal after clicking preview button', async () => {
    const { findByTestId, queryByTestId } = await setup();
    jest.runAllTimers();
    const previewButton = await findByTestId('preview-content');
    fireEvent.click(previewButton);
    const previewModal = await findByTestId('preview-modal');

    expect(previewModal).toBeTruthy();

    const hoverCard = queryByTestId('hover-card');
    expect(hoverCard).toBeNull();
  });

  it('should render open action', async () => {
    const { findByTestId } = await setup();
    jest.runAllTimers();
    const openButton = await findByTestId('hover-card-open-button');

    expect(openButton).toBeTruthy();
  });

  it('should open url in a new tab after clicking open button', async () => {
    const mockOpen = jest.fn();
    // @ts-ignore
    global.open = mockOpen;
    const { findByTestId } = await setup();
    jest.runAllTimers();

    const content = await findByTestId('smart-block-title-resolved-view');
    const openButton = await findByTestId('hover-card-open-button');
    fireEvent.click(openButton);

    expect(open).toHaveBeenCalledWith('https://some.url', '_blank');
    expect(content).toBeTruthy();
    mockOpen.mockRestore();
  });

  describe('analytics', () => {
    it('should fire viewed event when hover card is opened', async () => {
      const mock = jest.spyOn(analytics, 'uiHoverCardViewedEvent');

      const { findByTestId } = await setup();
      jest.runAllTimers();

      //wait for card to be resolved
      await findByTestId('smart-block-title-resolved-view');
      expect(analytics.uiHoverCardViewedEvent).toHaveBeenCalledTimes(1);
      expect(mock.mock.results[0].value).toEqual({
        action: 'viewed',
        actionSubject: 'hoverCard',
        attributes: {
          componentName: 'smart-cards',
          definitionId: 'd1',
          id: expect.any(String),
          extensionKey: 'confluence-object-provider',
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          previewDisplay: 'card',
          previewInvokeMethod: 'mouse_hover',
        },
        eventType: 'ui',
      });
    });

    it('should fire closed event when hover card is opened then closed', async () => {
      const mock = jest.spyOn(analytics, 'uiHoverCardDismissedEvent');

      const { queryByTestId, findByTestId, element } = await setup();
      jest.runAllTimers();
      // wait for card to be resolved
      await findByTestId('smart-block-title-resolved-view');
      fireEvent.mouseLeave(element);
      jest.runAllTimers();
      expect(queryByTestId('hover-card')).toBeNull();

      expect(analytics.uiHoverCardDismissedEvent).toHaveBeenCalledTimes(1);
      expect(mock.mock.results[0].value).toEqual({
        action: 'dismissed',
        actionSubject: 'hoverCard',
        attributes: {
          componentName: 'smart-cards',
          definitionId: 'd1',
          id: expect.any(String),
          extensionKey: 'confluence-object-provider',
          hoverTime: 0,
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          previewDisplay: 'card',
          previewInvokeMethod: 'mouse_hover',
        },
        eventType: 'ui',
      });
    });

    it('should fire render success event when hover card is rendered', async () => {
      const spy = jest.spyOn(analytics, 'uiRenderSuccessEvent');
      const { findByTestId } = await setup();
      jest.runAllTimers();
      await findByTestId('smart-block-title-resolved-view');

      // First render event is from the inline card
      // Second render event is flexible ui inside the hover card
      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(2);
      expect(spy.mock.results[1].value).toEqual({
        action: 'renderSuccess',
        actionSubject: 'smartLink',
        attributes: {
          id: expect.any(String),
          componentName: 'smart-cards',
          definitionId: 'd1',
          display: 'flexible',
          extensionKey: 'confluence-object-provider',
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          status: 'resolved',
        },
        eventType: 'ui',
      });
    });

    it('should fire clicked event when title is clicked', async () => {
      const spy = jest.spyOn(analytics, 'uiCardClickedEvent');
      const { findByTestId } = await setup();
      jest.runAllTimers();

      await findByTestId('smart-block-title-resolved-view');
      const link = await findByTestId('smart-element-link');

      fireEvent.click(link);

      expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
      expect(spy.mock.results[0].value).toEqual({
        action: 'clicked',
        actionSubject: 'smartLink',
        actionSubjectId: 'titleGoToLink',
        attributes: {
          componentName: 'smart-cards',
          definitionId: 'd1',
          display: 'flexible',
          extensionKey: 'confluence-object-provider',
          id: expect.any(String),
          isModifierKeyPressed: false,
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          status: 'resolved',
        },
        eventType: 'ui',
      });
    });

    it('should fire clicked event when open button is clicked', async () => {
      const spy = jest.spyOn(analytics, 'uiHoverCardOpenLinkClickedEvent');

      const { findByTestId } = await setup();
      jest.runAllTimers();
      // wait for card to be resolved
      await findByTestId('smart-block-title-resolved-view');
      const openButton = await findByTestId('hover-card-open-button');
      fireEvent.click(openButton);

      expect(analytics.uiHoverCardOpenLinkClickedEvent).toHaveBeenCalledTimes(
        1,
      );
      expect(spy.mock.results[0].value).toEqual({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'shortcutGoToLink',
        attributes: {
          componentName: 'smart-cards',
          definitionId: 'd1',
          id: expect.any(String),
          extensionKey: 'confluence-object-provider',
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          previewDisplay: 'card',
        },
        eventType: 'ui',
      });
    });

    it('should fire clicked event and close event when preview button is clicked', async () => {
      const clickSpy = jest.spyOn(analytics, 'uiActionClickedEvent');
      const closeSpy = jest.spyOn(analytics, 'uiHoverCardDismissedEvent');

      const { findByTestId } = await setup(mockBaseResponseWithPreview);
      jest.runAllTimers();

      await findByTestId('smart-block-title-resolved-view');
      const button = await findByTestId('preview-content');

      fireEvent.click(button);

      expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
      expect(clickSpy.mock.results[0].value).toEqual({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'invokePreviewScreen',
        attributes: {
          actionType: 'PreviewAction',
          componentName: 'smart-cards',
          display: 'flexible',
          definitionId: 'd1',
          id: expect.any(String),
          extensionKey: 'test-object-provider',
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
        },
        eventType: 'ui',
      });
      expect(analytics.uiHoverCardDismissedEvent).toHaveBeenCalledTimes(1);
      expect(closeSpy.mock.results[0].value).toEqual({
        action: 'dismissed',
        actionSubject: 'hoverCard',
        attributes: {
          componentName: 'smart-cards',
          definitionId: 'd1',
          id: expect.any(String),
          extensionKey: 'test-object-provider',
          hoverTime: 0,
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          previewDisplay: 'card',
          previewInvokeMethod: 'mouse_hover',
        },
        eventType: 'ui',
      });
    });

    it('should fire clicked event when download button is clicked', async () => {
      const spy = jest.spyOn(analytics, 'uiActionClickedEvent');
      const { findByTestId } = await setup(mockBaseResponseWithDownload);
      jest.runAllTimers();

      await findByTestId('smart-block-title-resolved-view');
      const button = await findByTestId('download-content');

      fireEvent.click(button);

      expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
      expect(spy.mock.results[0].value).toEqual({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'downloadDocument',
        attributes: {
          actionType: 'DownloadAction',
          componentName: 'smart-cards',
          display: 'flexible',
          id: expect.any(String),
          definitionId: 'd1',
          extensionKey: 'test-object-provider',
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
        },
        eventType: 'ui',
      });
    });

    it('should fire render failed event when hover card errors during render', async () => {
      const mock = jest.spyOn(analytics, 'uiRenderFailedEvent');
      jest.spyOn(analytics, 'fireSmartLinkEvent');
      jest
        .spyOn(HoverCardComponent, 'HoverCardComponent')
        .mockImplementation(() => {
          throw new Error('something happened');
        });

      //setup function implicitly tests that the inline link resolved view is still in the DOM
      await setup();
      jest.runAllTimers();

      await waitFor(() => expect(analytics.fireSmartLinkEvent).toBeCalled(), {
        timeout: 5000,
      });
      expect(analytics.uiRenderFailedEvent).toHaveBeenCalledTimes(1);
      expect(mock.mock.results[0].value).toEqual({
        action: 'renderFailed',
        actionSubject: 'smartLink',
        attributes: {
          componentName: 'smart-cards',
          error: new Error('something happened'),
          errorInfo: expect.any(Object),
          display: 'flexible',
          definitionId: 'd1',
          extensionKey: 'confluence-object-provider',
          id: expect.any(String),
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
        },
        eventType: 'ui',
      });
    });
  });

  describe('feature flags:', () => {
    const setupWithFF = async (providerFF?: boolean, cardFF?: boolean) => {
      mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
      mockClient = new (fakeFactory(mockFetch))();
      mockUrl = 'https://some.url';

      const { queryByTestId, findByTestId } = render(
        <Provider
          client={mockClient}
          featureFlags={{ showHoverPreview: providerFF }}
        >
          <Card appearance="inline" url={mockUrl} showHoverPreview={cardFF} />
        </Provider>,
      );

      const element = await findByTestId('inline-card-resolved-view');
      jest.useFakeTimers();
      fireEvent.mouseEnter(element);
      jest.runAllTimers();
      return { findByTestId, queryByTestId };
    };

    const cases: [
      'should' | 'should not',
      boolean | undefined,
      boolean | undefined,
    ][] = [
      ['should not', undefined, undefined],
      ['should', true, undefined],
      ['should not', false, undefined],
      ['should', undefined, true],
      ['should', true, true],
      ['should', false, true],
      ['should not', undefined, false],
      ['should not', true, false],
      ['should not', false, false],
    ];
    test.each(cases)(
      'hover card %p render when prop is %p on provider and %p on card',
      async (outcome, providerFF, cardFF) => {
        if (outcome === 'should') {
          const { findByTestId } = await setupWithFF(providerFF, cardFF);
          expect(await findByTestId('hover-card')).toBeDefined();
        } else {
          const { queryByTestId } = await setupWithFF(providerFF, cardFF);
          expect(queryByTestId('hover-card')).toBeNull();
        }
      },
    );
  });

  it('does not propagate event to parent when clicking inside hover card content', async () => {
    const containerOnClick = jest.fn();
    mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
    mockClient = new (fakeFactory(mockFetch))();

    const { findByTestId } = render(
      <div onClick={containerOnClick}>
        <Provider client={mockClient}>
          <Card
            appearance="inline"
            url="https://some.url"
            showHoverPreview={true}
          />
        </Provider>
      </div>,
    );

    const element = await findByTestId('inline-card-resolved-view');
    jest.useFakeTimers();
    fireEvent.mouseEnter(element);
    jest.runAllTimers();

    const content = await findByTestId('smart-links-container');
    fireEvent.click(content);

    const link = await findByTestId('smart-element-link');
    fireEvent.click(link);

    const previewButton = await findByTestId('preview-content');
    fireEvent.click(previewButton);

    expect(containerOnClick).not.toHaveBeenCalled();
  });

  describe('SSR links', () => {
    const setupWithSSR = async () => {
      let resolveFetch = (value: unknown) => {};
      let rejectFetch = (reason: any) => {};
      const mockPromise = new Promise((resolve, reject) => {
        resolveFetch = resolve;
        rejectFetch = reject;
      });
      mockFetch = jest.fn(() => mockPromise);
      mockClient = new (fakeFactory(mockFetch))();
      mockUrl = 'https://some.url';
      const storeOptions: any = {
        initialState: {
          [mockUrl]: {
            status: 'resolved',
            details: mockSSRResponse,
          },
        },
      };

      const { findByTestId, queryByTestId } = render(
        <Provider client={mockClient} storeOptions={storeOptions}>
          <Card appearance="inline" url={mockUrl} showHoverPreview={true} />
        </Provider>,
      );

      expect(mockFetch).toBeCalledTimes(0);
      const element = await findByTestId('inline-card-resolved-view');
      expect(element.textContent).toBe('I am a fan of cheese');

      jest.useFakeTimers();
      fireEvent.mouseEnter(element);
      jest.runAllTimers();
      await waitFor(() => expect(mockFetch).toBeCalledTimes(1));

      return { findByTestId, queryByTestId, resolveFetch, rejectFetch };
    };

    it('should render hover card correctly', async () => {
      const {
        findByTestId,
        queryByTestId,
        resolveFetch,
      } = await setupWithSSR();

      await findByTestId('hover-card-loading-view');
      resolveFetch(mockConfluenceResponse);
      jest.runAllTimers();

      await findByTestId('smart-block-metadata-resolved-view');
      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      const snippetBlock = await findByTestId(
        'smart-block-snippet-resolved-view',
      );
      const footerBlock = await findByTestId(
        'smart-footer-block-resolved-view',
      );
      expect(queryByTestId('hover-card-loading-view')).toBeNull();

      //trim because the icons are causing new lines in the textContent
      expect(titleBlock.textContent?.trim()).toBe('I love cheese');
      expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
      expect(footerBlock.textContent?.trim()).toBe('ConfluenceCommentPreview');
    });

    it('should fall back to default path if fetch fails', async () => {
      const { rejectFetch, queryByTestId, findByTestId } = await setupWithSSR();

      await findByTestId('hover-card-loading-view');
      rejectFetch('error');

      const titleBlock = await findByTestId('smart-block-title-resolved-view');
      const snippetBlock = await findByTestId(
        'smart-block-snippet-resolved-view',
      );
      const footerBlock = await findByTestId(
        'smart-footer-block-resolved-view',
      );
      expect(queryByTestId('hover-card-loading-view')).toBeNull();

      //trim because the icons are causing new lines in the textContent
      expect(titleBlock.textContent?.trim()).toBe('I am a fan of cheese');
      expect(snippetBlock.textContent).toBe('');
      expect(footerBlock.textContent?.trim()).toBe('');
    });
  });
});
