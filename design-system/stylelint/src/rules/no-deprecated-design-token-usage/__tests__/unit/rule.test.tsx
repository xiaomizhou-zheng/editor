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
import { ruleName } from '../../index';

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
          color: var(--ds-text-highEmphasis);
          color: var(--ds-text-highEmphasis, red);
          color: var(--ds-text-selected);
          color: var(--ds-text-selected, blue);
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
      description: 'should accept non-deprecated token',
    },
  ],
});
