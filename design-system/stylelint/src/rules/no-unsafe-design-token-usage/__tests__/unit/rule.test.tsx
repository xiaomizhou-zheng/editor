jest.mock('@atlaskit/tokens/rename-mapping', (): RenameMap[] => [
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

import tokens from '@atlaskit/tokens/token-names';

import testRule from '../../../../__tests__/utils/_test-rule';
import { messages, ruleName } from '../../index';

const plugin = path.resolve(__dirname, '../../../../index.tsx');

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'deprecated' | 'deleted';
  replacement: Token;
};

testRule({
  plugins: [plugin],
  ruleName,
  config: [false],
  accept: [
    {
      code: `
        .evil {
          color: var(--ds-fake-news);
          color: var(--ds-text-highEmphasis);
          color: var(--ds-text-highEmphasis, red);
        }
      `,
      description: 'should not do any checks when isEnabled is false',
    },
  ],
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true],
  accept: [
    {
      code: 'color: var(--ds-text);',
      description: 'should accept missing fallbacks by default',
    },
    {
      code: 'color: var(--ds-text-highEmphasis);',
      description:
        'should accept missing fallbacks on deprecated tokens by default',
    },
  ],
  reject: [
    {
      code: 'color: var(--ds-text-highEmphasis, black);',
      description: 'should reject fallbacks by default',
      message: messages.hasFallback,
    },
  ],
});
