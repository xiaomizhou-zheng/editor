jest.mock('@atlaskit/tokens/rename-mapping', (): typeof renameMapper => [
  {
    path: 'color.text.highEmphasis',
    state: 'deprecated',
    replacement: 'color.text.[default]',
  },
  {
    path: 'shadow.overlay',
    state: 'deleted',
    replacement: 'elevation.shadow.overlay',
  },
]);

import path from 'path';

import renameMapper from '@atlaskit/tokens/rename-mapping';

import testRule from '../../../../__tests__/utils/_test-rule';
import { messages, ruleName } from '../../index';

const plugin = path.resolve(__dirname, '../../../../index.tsx');

testRule({
  plugins: [plugin],
  ruleName,
  config: [true, { shouldEnsureFallbackUsage: false }],
  accept: [
    {
      code: 'color: var(--ds-text);',
      description: 'should allow tokens used without a fallback',
    },
    {
      code: 'color: var(--ds-text-highEmphasis);',
      description: 'should allow deprecated tokens used without a fallback',
    },
    {
      code: `
        background:
          linear-gradient(
            var(--ds-background-accent-blue),
            var(--ds-background-accent-blue-bold)
          );
      `,
      description:
        'should allow tokens used without a fallback inside a function',
    },
  ],
  reject: [
    {
      code: 'color: var(--ds-text, red);',
      message: messages.hasFallback,
      description: 'should not allow tokens used with a fallback',
    },
    {
      code: 'color: var(--ds-text-highEmphasis, black);',
      description: 'should not allow deprecated tokens used with a fallback',
      message: messages.hasFallback,
    },
    {
      code: `
        background:
          linear-gradient(
            var(--ds-background-accent-blue, lightBlue),
            var(--ds-background-accent-blue-bold, blue)
          );
      `,
      description:
        'should not allow tokens used with a fallback inside a function',
      warnings: [
        { message: messages.hasFallback },
        { message: messages.hasFallback },
      ],
    },
  ],
});
