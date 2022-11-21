import {
  akEditorFullWidthLayoutLineLength,
  akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';

import { breakoutConsts, calculateBreakoutStyles } from '../breakout';

describe('breakout utils', () => {
  describe('calculateBreakoutStyles', () => {
    it('should return with type "line-length-unknown" when widthStateLineLength is not provided', () => {
      const breakoutStyles = calculateBreakoutStyles({
        mode: 'full-width',
        widthStateWidth: 0,
      });
      expect(breakoutStyles.type).toBe('line-length-unknown');
    });
    it('should return with type "line-length-known" when widthStateLineLength is provided', () => {
      const breakoutStyles = calculateBreakoutStyles({
        mode: 'full-width',
        widthStateWidth: 1200,
        widthStateLineLength: 800,
      });
      expect(breakoutStyles.type).toBe('line-length-known');
    });

    // note: these tests are using random values
    // the logic powering this method pre existed these tests
    // and the intent of these tests is to avoid regressions.
    it('should have consistent results for default width', () => {
      const breakoutStyles1 = calculateBreakoutStyles({
        mode: 'wide',
        widthStateWidth: breakoutConsts.defaultLayoutWidth,
        widthStateLineLength: breakoutConsts.defaultLayoutWidth,
      });
      expect(breakoutStyles1).toMatchInlineSnapshot(`
        Object {
          "marginLeft": "NaNpx",
          "type": "line-length-known",
          "width": "100%",
        }
      `);

      const breakoutStyles2 = calculateBreakoutStyles({
        mode: 'full-width',
        widthStateWidth: breakoutConsts.defaultLayoutWidth + 100,
        widthStateLineLength: breakoutConsts.defaultLayoutWidth,
      });
      expect(breakoutStyles2).toMatchInlineSnapshot(`
        Object {
          "marginLeft": "-2px",
          "type": "line-length-known",
          "width": "764px",
        }
      `);

      const breakoutStyles3 = calculateBreakoutStyles({
        mode: 'full-width',
        widthStateWidth: breakoutConsts.defaultLayoutWidth + 200,
        widthStateLineLength: breakoutConsts.defaultLayoutWidth,
      });
      expect(breakoutStyles3).toMatchInlineSnapshot(`
        Object {
          "marginLeft": "-52px",
          "type": "line-length-known",
          "width": "864px",
        }
      `);
    });
  });

  // note: these tests are using random values
  // the logic powering this method pre existed these tests
  // and the intent of these tests is to avoid regressions.
  it('should have consistent results for full width layout', () => {
    const breakoutStyles1 = calculateBreakoutStyles({
      mode: 'full-width',
      widthStateWidth: akEditorFullWidthLayoutWidth,
      widthStateLineLength: akEditorFullWidthLayoutLineLength,
    });
    expect(breakoutStyles1).toMatchInlineSnapshot(`
      Object {
        "marginLeft": "44px",
        "type": "line-length-known",
        "width": "1704px",
      }
    `);

    const breakoutStyles2 = calculateBreakoutStyles({
      mode: 'full-width',
      widthStateWidth: akEditorFullWidthLayoutWidth + 100,
      widthStateLineLength: akEditorFullWidthLayoutLineLength,
    });
    expect(breakoutStyles2).toMatchInlineSnapshot(`
      Object {
        "marginLeft": "-4px",
        "type": "line-length-known",
        "width": "1800px",
      }
    `);

    const breakoutStyles3 = calculateBreakoutStyles({
      mode: 'full-width',
      widthStateWidth: akEditorFullWidthLayoutWidth - 100,
      widthStateLineLength: akEditorFullWidthLayoutLineLength - 100,
    });
    expect(breakoutStyles3).toMatchInlineSnapshot(`
      Object {
        "marginLeft": "44px",
        "type": "line-length-known",
        "width": "1604px",
      }
    `);
  });
});
