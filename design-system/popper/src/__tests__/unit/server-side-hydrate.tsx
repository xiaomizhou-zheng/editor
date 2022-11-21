import React from 'react';

import ReactDOM from 'react-dom';
import waitForExpect from 'wait-for-expect';

import noop from '@atlaskit/ds-lib/noop';
import { getExamplesFor, ssr } from '@atlaskit/ssr';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class Popper {
    static placements = PopperJS.placements;

    constructor() {
      return {
        // eslint-disable-next-line @repo/internal/react/use-noop
        destroy: () => {},
        // eslint-disable-next-line @repo/internal/react/use-noop
        scheduleUpdate: () => {},
      };
    }
  };
});

// @ts-ignore
jest.spyOn(global.console, 'error').mockImplementation(noop);

afterEach(() => {
  jest.resetAllMocks();
});

//TODO fix react popper act() error
test('should ssr then hydrate popper correctly', async () => {
  const [example] = await getExamplesFor('popper');
  const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  await waitForExpect(() => {
    // ignore warnings caused by emotion's server-side rendering approach
    // @ts-ignore
    // eslint-disable-next-line no-console
    const mockCalls = console.error.mock.calls.filter(
      // @ts-ignore
      ([f, s]) =>
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
