import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

// Mock rename mapping in case it changes
jest.mock('@atlaskit/tokens/rename-mapping', () => ({
  __esModule: true,
  default: { 'tokenName.old': 'tokenName.new' },
}));

tester.run('ensure-design-token-usage', rule, {
  valid: [
    // Using config -> shouldEnforceFallbacks: false
    {
      code: `token('shadow.card')`,
    },
    {
      code: `const background = 'hey';`,
    },
    {
      code: `import { e100 } from 'lib';`,
    },
    {
      code: `
      css({background:'none'})
      `,
    },
    {
      code: `
        import { B100 } from '@atlaskit/theme/colors';
      `,
    },
    {
      code: `
        css({
          boxShadow: token('shadow.card'),
        })
      `,
    },
    {
      code: `
        css\`
          box-shadow: \${token('shadow.card')};
        \`
      `,
    },
    {
      code: `
        css\`
          color: inherit;
          color: token('color.background.blanket');
        \`
      `,
    },
    {
      code: `
      styled.div\`
        color: inherit;
        color: \${token('color.background.blanket')};
      \`
    `,
    },
    {
      code: `
      const number = 123;
      const aString = number.toString();
    `,
    },
    {
      code: `
      wrapper.find('#eeeeee').exists()
      `,
    },
    {
      code: `const green = token('color.background.accent.green');`,
    },
    {
      code: `
      const colors = { green: token('color.background.accent.green') };
      return colors.green;
      `,
    },
    {
      code: `
      const green = token('color.background.accent.green');
      const colors = { green };
      `,
    },
    {
      code: `
      colors.green = token('color.background.accent.green');
      colors['blue'] = token('color.background.accent.blue');
      `,
    },
    {
      code: `const GOLD_YEARLY = Products.Member.Gold.yearly;`,
    },
    // Using config -> shouldEnforceFallbacks: true
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `token('shadow.card', background())`,
    },
    {
      code: `const background = 'hey';`,
    },
    {
      code: `import { e100 } from 'lib';`,
    },
    {
      code: `css({background:'none'})`,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `import { B100 } from '@atlaskit/theme/colors';`,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
      css({
        boxShadow: token('shadow.card', 'red'),
      })
    `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
      css\`
        box-shadow: \${token('shadow.card', 'red')};
      \`
    `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
      css\`
        color: inherit;
        color: \${token('color.background.blanket', 'red')};
      \`
    `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
      styled.div\`
        color: inherit;
        color: \${token('color.background.blanket', 'red')};
      \`
    `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
      token('color.background.blanket', 'red');
      token('color.background.blanket', B100);
      token('color.background.blanket', colors.B200);
    `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
      token('color.background.blanket', 'red');
    `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
      const number = 123;
      const aString = number.toString();
    `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
    css({
      backgroundColor: token('color.background.blanket', background())
    })
    `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
    wrapper.find('#eeeeee').exists()
    `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
    const state = {
      value: 'red',
      color: 'blue',
      textColor: text(),
      bgColor: background,
    };
    `,
    },
    `const { value } = { color: 'blue' };`,
    `
    const options = [{ name: 'red', value: 'red', label: 'red' }]
    `,
    `
    const truncateCss = css\`
      white-space: nowrap;
    \`;
    `,
    `console.log(\`Removed \${text}.\`);`,
    `export const App = () => <SimpleTag text="Base Tag" testId="standard" />;`,
    `export const App = () => <Avatar src="0x400" />;`,
    // Qualified type identifiers are parsable
    `const options: Foo.Bar = { color: 'red' };`,
    // Using config -> exceptions: ['dangerouslyGetComputedToken', 'gold']
    {
      options: [
        {
          shouldEnforceFallbacks: false,
          exceptions: ['dangerouslyGetComputedToken', 'gold'],
        },
      ],
      code: `dangerouslyGetComputedToken('color.text', N800);`,
    },
    {
      options: [
        {
          shouldEnforceFallbacks: false,
          exceptions: ['dangerouslyGetComputedToken', 'gold'],
        },
      ],
      code: `
        const GOLD_YEARLY = Products.Member.Gold.yearly;
        useQuery({
          variables: {
            product: GOLD_YEARLY,
          },
        });
      `,
    },
  ],
  invalid: [
    {
      code: `const exampleColors = [N800, B500];`,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `
          css\`
            \${e100};
          \`
        `,
      output: `
          css\`
            background-color: $\{token('color.background.card')};
            box-shadow: \${token('shadow.card')};
          \`
        `,
      errors: [{ messageId: 'legacyElevation' }],
    },
    {
      code: `css\`\${text};\``,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `
          css\`
            box-shadow: 0px 1px 1px #161A1D32;
          \`
        `,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `
          css({
            boxShadow: '0px 1px 1px #161A1D32',
          })
        `,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `css({ color: 'red' })`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `
            css\`
              white-space: nowrap;
              color: red;
              background-color: #ccc;
              border-color: rgb(0, 0, 0);
              outline-color: rgba(0, 0, 0, 0.5);
              box-shadow: 0px 1px 1px hsl(0, 100%, 50%);
              border-top-color: hsla(0, 100%, 50%, 0.5);
              border-left-color: lch(29.2345% 44.2 27);
              border-right-color: lab(29.2345% 39.3825 20.0664);
              border-bottom-color: color(display-p3 1 0.5 0);
            \`;
          `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `
            styled.div\`
              white-space: nowrap;
              color: red;
              background-color: #ccc;
              border-color: rgb(0, 0, 0);
              outline-color: rgba(0, 0, 0, 0.5);
              box-shadow: 0px 1px 1px hsl(0, 100%, 50%);
              border-top-color: hsla(0, 100%, 50%, 0.5);
              border-left-color: lch(29.2345% 44.2 27);
              border-right-color: lab(29.2345% 39.3825 20.0664);
              border-bottom-color: color(display-p3 1 0.5 0);
            \`;
          `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `
          css({
            backgroundColor: background(),
          });
        `,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `
          css({
            color: colors.B100,
            color: P100,
          });
        `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `
            css({
              color: 'red',
              color: 'orange',
            });
          `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `
            css({
              color: 'hsl(30, 100%, 50%, 0.6)',
              color: 'hsla(30, 100%, 50%, 0.6)',
            });
          `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `
            css({
              color: 'rgb(0, 0, 0)',
              color: 'rgba(0, 0, 0, 0.5)',
            });
          `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `
            css({
              color: '#ccc',
              color: '#cccaaa',
              color: '#cccaaaff'
            })
          `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `css({ boxShadow: '0 0 0 2px white' })`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<div color="red">Hello</div>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon fill="rgb(255, 171, 0)">Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon stroke="1px solid rgb(255, 171, 0)">Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon fill={B400}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon css={{ color: B400 }}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon css={css({ color: B400 })}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon css={css\`color: \${B400}\`}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon css={css\`color: #eee;\`}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon fill={colors.B400}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `const myStyles = { color: 'red' };`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `const options: CSSProperties = { color: 'red' };`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `const options: CSSObject = { color: 'red' };`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `
        const MARKER_LABEL_COLORS = new Map([
          ['black', Colors.N600],
          ['blue', Colors.TrelloBlue500],
          ['green', Colors.Green500],
        ]);
      `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
  ],
});
