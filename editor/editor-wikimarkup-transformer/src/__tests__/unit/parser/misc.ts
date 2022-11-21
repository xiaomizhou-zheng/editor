import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Misc', () => {
  const testCases: Array<[string, string]> = [
    [
      'should find emojis in text',
      'this is a string with :) emojis in it (*) tada',
    ],
    [
      'should find emojis in text with marks',
      'this is a string ~with :) emojis~ in it (*) tada',
    ],
    ['an emoji itself should work too', ':)'],
    [':puppy: should not be an emoji clusterfuck', ':puppy:'],
    ['an emoji with characters after should not be an emoji', ':)hello'],
    ['an emoji with characters before should still be an emoji', 'hello:)'],
    ['an emoji at the end of line should still be emoji', 'hello:)\n'],
    [
      'an emoji with characters before and after should not be an emoji',
      'hello:)hello',
    ],
    [
      'an emoji with characters before and after with a whitespace should be an emoji',
      'hello:) hello',
    ],
    [
      'should find emojis and mentions in text',
      'this is a string with :) emojis and [~username] mentions',
    ],
    ['should escape macros', 'this is a \\{panel} text, not a macro{panel}'],
    [
      'should escape monospace text',
      'this is a \\{{normal text}}, not a monospaced',
    ],
    [
      '[CS-480] this is not a list',
      `-
this is not a list`,
    ],
    [
      'It should be possible to have a ruler as the final line of text',
      `Hi
----`,
    ],
    ['It should be possible to have a ruler as the only thing', '----'],
    [
      'ESS-2440 should render consecutive emojis correctly',
      'emoji prefix (/)(*)(i) emoji suffix',
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
