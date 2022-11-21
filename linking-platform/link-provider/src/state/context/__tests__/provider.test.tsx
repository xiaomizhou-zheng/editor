import { CardProviderProps } from '../types';

jest.mock('@atlaskit/linking-common/extractors', () => ({
  ...jest.requireActual<Object>('@atlaskit/linking-common/extractors'),
  extractPreview: () => 'some-link-preview',
}));

import React from 'react';
import { render } from '@testing-library/react';
import { SmartCardContext as Context } from '..';
import CardClient from '../../../client';
import { SmartCardProvider, CardContext } from '..';
import { CardStore } from '@atlaskit/linking-common';

describe('Provider', () => {
  it('should setup provider with default options', () => {
    const fn = jest.fn();
    const client = new CardClient();
    render(
      <SmartCardProvider client={client}>
        <Context.Consumer>{fn}</Context.Consumer>
      </SmartCardProvider>,
    );

    expect(fn).toBeCalledWith(
      expect.objectContaining({
        config: {
          authFlow: 'oauth2',
        },
        connections: {
          client,
        },
      }),
    );
  });

  it('should setup provider with custom options', () => {
    const fn = jest.fn();
    const client = new CardClient();
    render(
      <SmartCardProvider client={client}>
        <Context.Consumer>{fn}</Context.Consumer>
      </SmartCardProvider>,
    );
    expect(fn).toBeCalledWith(
      expect.objectContaining({
        config: {
          authFlow: 'oauth2',
        },
        connections: {
          client,
        },
      }),
    );
  });

  it('should reuse top-level provider when nested with other providers', () => {
    const fn = jest.fn();
    const client = new CardClient();
    render(
      <SmartCardProvider client={client}>
        <SmartCardProvider client={client}>
          <Context.Consumer>{fn}</Context.Consumer>
        </SmartCardProvider>
      </SmartCardProvider>,
    );
    expect(fn).toBeCalledWith(
      expect.objectContaining({
        config: {
          authFlow: 'oauth2',
        },
        connections: {
          client,
        },
      }),
    );
  });

  it('should expose extractors to consumers', () => {
    const fn = (context?: CardContext) => {
      const linkPreview = context && context.extractors.getPreview('some-url');
      expect(linkPreview).toEqual('some-link-preview');
      return <div></div>;
    };

    const client = new CardClient();
    const initialState: CardStore = {
      'some-url': {
        status: 'resolved',
        details: {} as any,
      },
    };

    render(
      <SmartCardProvider client={client} storeOptions={{ initialState }}>
        <Context.Consumer>{fn}</Context.Consumer>
      </SmartCardProvider>,
    );
  });

  const initialState = {};
  it.each<[string, Partial<CardProviderProps>, Partial<CardProviderProps>]>([
    ['feature flags are', {}, { featureFlags: { showHoverPreview: false } }],
    ['card client is', {}, { client: new CardClient() }],
    ['auth flow is', {}, { authFlow: 'disabled' }],
    ['renderers are', {}, { renderers: {} }],
    [
      'whole store options outside object reference is',
      { storeOptions: { initialState } },
      { storeOptions: { initialState } },
    ],
  ])(
    'should not re-create store when %s updated',
    (_, initialProviderProps, newProviderProps) => {
      const fn = jest.fn();
      const { rerender } = render(
        <SmartCardProvider {...initialProviderProps}>
          <Context.Consumer>{fn}</Context.Consumer>
        </SmartCardProvider>,
      );

      expect(fn).toBeCalledTimes(1);

      const { store } = fn.mock.calls[0][0] as CardContext;

      rerender(
        <SmartCardProvider {...newProviderProps}>
          <Context.Consumer>{fn}</Context.Consumer>
        </SmartCardProvider>,
      );

      expect(fn).toBeCalledTimes(2);

      const { store: newStore } = fn.mock.calls[1][0] as CardContext;

      expect(store).toBe(newStore);
    },
  );

  it('should re-create redux store when initialState prop has updated', () => {
    const fn = jest.fn();
    const { rerender } = render(
      <SmartCardProvider storeOptions={{ initialState }}>
        <Context.Consumer>{fn}</Context.Consumer>
      </SmartCardProvider>,
    );

    expect(fn).toBeCalledTimes(1);

    const { store } = fn.mock.calls[0][0] as CardContext;

    rerender(
      <SmartCardProvider storeOptions={{ initialState: {} }}>
        <Context.Consumer>{fn}</Context.Consumer>
      </SmartCardProvider>,
    );

    expect(fn).toBeCalledTimes(2);

    const { store: newStore } = fn.mock.calls[1][0] as CardContext;

    expect(store).not.toBe(newStore);
  });
});
