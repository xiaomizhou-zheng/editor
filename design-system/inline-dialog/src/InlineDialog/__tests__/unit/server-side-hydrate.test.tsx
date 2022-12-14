import React from 'react';

import ReactDOM from 'react-dom';
import waitForExpect from 'wait-for-expect';

import __noop from '@atlaskit/ds-lib/noop';
import { getExamplesFor, ssr } from '@atlaskit/ssr';

declare var global: any;

jest.spyOn(global.console, 'error').mockImplementation(__noop);

jest.mock('popper.js', () => {
  // @ts-ignore requireActual property is missing from jest
  const PopperJS = jest.requireActual('popper.js');

  return class Popper {
    static placements = PopperJS.placements;

    constructor() {
      return {
        // eslint-disable-next-line
        destroy: () => {},
        // eslint-disable-next-line
        update: () => {},
      };
    }
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate inline-dialog correctly', async () => {
  const [example] = await getExamplesFor('inline-dialog');
  const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  await waitForExpect(() => {
    // ignore warnings caused by emotion's server-side rendering approach
    // @ts-ignore
    // eslint-disable-next-line no-console
    const mockCalls = console.error.mock.calls.filter(
      ([f, s]: [string, string]) =>
        !(
          (f ===
            'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' &&
            s === 'style') ||
          f.includes(
            'Warning: An update to %s inside a test was not wrapped in act',
          )
        ),
    );
    expect(mockCalls.length).toBe(0);
  });
});
