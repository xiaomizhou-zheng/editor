import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

const IntlWrapper: React.FC<{ locale?: string }> = ({
  children,
  locale = 'en',
}) => {
  return <IntlProvider locale={locale}>{children}</IntlProvider>;
};

/**
 * Render the given element from testing-library wrapped in react-intl-next context
 * @param ui React element
 * @param options optional extral options
 * @returns
 */
export const renderWithIntl: (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => RenderResult = (ui, options = {}) =>
  render(ui, { wrapper: IntlWrapper, ...options });

/**
 * Helper utility to suppress the react-dom "act" warning when using React 16.8.0
 * {@link https://github.com/testing-library/react-testing-library/issues/459}
 * @param onBeforeAllCallback Optional callback when jest event for beforeAll has executed
 * @param onAfterAllCallback Optional callback when jest event for afterAll has executed
 */
export function mockReactDomWarningGlobal(
  onBeforeAllCallback = () => {},
  onAfterAllCallback = () => {},
): void {
  const originalError = global.console.error;
  beforeAll(() => {
    global.console.error = jest.fn((...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Please upgrade to at least react-dom@16.9.0')
      ) {
        return;
      }
      return originalError.call(console, args);
    });
    onBeforeAllCallback();
  });

  afterAll(() => {
    (global.console.error as jest.Mock).mockRestore();
    onAfterAllCallback();
  });
}

/**
 * Apply usage of fake timers when required.
 * {@link https://testing-library.com/docs/using-fake-timers}
 * @param onBeforeEachCallback Optional callback when jest event for beforeEach has executed
 * @param onAfterEachCallback Optional callback when jest event for afterEach has executed
 */
export function useFakeTimers(
  onBeforeEachCallback = () => {},
  onAfterEachCallback = () => {},
): void {
  beforeEach(() => {
    jest.useFakeTimers();
    onBeforeEachCallback();
  });

  // Running all pending timers and switching to real timers using Jest

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    onAfterEachCallback();
  });
}
