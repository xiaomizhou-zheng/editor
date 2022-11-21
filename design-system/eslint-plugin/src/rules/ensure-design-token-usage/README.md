# @atlaskit/eslint-plugin-design-system/ensure-design-token-usage

Ensures a codebase uses the global `token` function rather than using hard-coded values. This ruleset is great for codebases that are both starting to adopt tokens, and ones that already have adopted them. It helps new contributors from accidentally adding hard-coded colour values.

## Examples

👎 Example of **incorrect** code for this rule:

```js
css({
  color: 'red',
          ^^^
});
```

```js
css({
  boxShadow: '0px 1px 1px #161A1D32',
                          ^^^^^^^^^
})
```

```js
import { e100 } from '@atlaskit/theme/elevation';

css`
  ${e100};
    ^^^^
`;
```

```js
import { B100 } from '@atlaskit/theme/colors';

css({
  color: B100,
         ^^^^
});
```

👍 Example of **correct** code for this rule:

```js
import { token } from '@atlaskit/tokens';

css({
  boxShadow: token('elevation.shadow.card'),
});
```

```js
import { token } from '@atlaskit/tokens';

css`
  color: ${token('color.text.highemphasis')};
`;
```
