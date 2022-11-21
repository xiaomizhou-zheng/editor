import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { CardState } from '@atlaskit/linking-common';
import FlexibleCard from '../index';
import { TitleBlock } from '../components/blocks';
import { SmartLinkStatus } from '../../../constants';

describe('FlexibleCard', () => {
  const title = 'some-name';
  const url = 'http://some-url.com';

  it('renders flexible card', async () => {
    const cardState: CardState = {
      status: 'resolved',
      details: {
        meta: {
          access: 'granted',
          visibility: 'public',
        },
        data: {
          '@type': 'Object',
          '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
          },
          url,
          name: title,
        },
      },
    };

    const { getByTestId } = render(
      <FlexibleCard cardState={cardState} url={url}>
        <TitleBlock />
      </FlexibleCard>,
    );

    const container = await getByTestId('smart-links-container');
    const titleBlock = await getByTestId('smart-block-title-resolved-view');

    expect(container).toBeTruthy();
    expect(titleBlock).toBeTruthy();
    expect(titleBlock.textContent).toEqual(title);
  });

  describe('status', () => {
    it('triggers onResolve callback on resolved', async () => {
      const onResolve = jest.fn();
      const cardState = {
        status: 'resolved',
        details: { meta: {}, data: { name: title, url } },
      } as CardState;

      render(
        <FlexibleCard cardState={cardState} url={url} onResolve={onResolve}>
          <TitleBlock />
        </FlexibleCard>,
      );

      expect(onResolve).toHaveBeenCalledWith({ title, url });
    });

    it('triggers onResolve callback on resolved', async () => {
      const onResolve = jest.fn();
      const cardState = {
        status: SmartLinkStatus.Resolved,
        details: { meta: {}, data: { name: title, url } },
      } as CardState;

      render(
        <FlexibleCard cardState={cardState} onResolve={onResolve} url={url}>
          <TitleBlock />
        </FlexibleCard>,
      );

      expect(onResolve).toHaveBeenCalledWith({ title, url });
    });

    it.each([
      [SmartLinkStatus.Errored],
      [SmartLinkStatus.Fallback],
      [SmartLinkStatus.Forbidden],
      [SmartLinkStatus.NotFound],
      [SmartLinkStatus.Unauthorized],
    ])(
      'triggers onError callback with %s status',
      async (status: SmartLinkStatus) => {
        const onError = jest.fn();
        const cardState = {
          status,
          details: { meta: {}, data: { url } },
        } as CardState;

        render(
          <IntlProvider locale="en">
            <FlexibleCard cardState={cardState} onError={onError} url={url}>
              <TitleBlock />
            </FlexibleCard>
          </IntlProvider>,
        );

        expect(onError).toHaveBeenCalledWith({ status, url });
      },
    );
  });
});
