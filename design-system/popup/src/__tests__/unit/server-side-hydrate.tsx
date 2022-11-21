import React from 'react';

import ReactDOM from 'react-dom';
import waitForExpect from 'wait-for-expect';

import __noop from '@atlaskit/ds-lib/noop';
import { getExamplesFor, ssr } from '@atlaskit/ssr';

beforeEach(() => {
  jest.spyOn(global.console, 'error').mockImplementation(__noop);
  jest.setTimeout(10000);
});

afterEach(() => {
  jest.resetAllMocks();
});
// https://product-fabric.atlassian.net/browse/BUILDTOOLS-282: SSR tests are still timing out in Landkid.
test.skip('should ssr then hydrate drawer popup', async () => {
  const [example] = await getExamplesFor('popup');
  const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

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
          f ===
            'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' &&
          s === 'style'
        ),
    );
    expect(mockCalls.length).toBe(0);
  });
});
