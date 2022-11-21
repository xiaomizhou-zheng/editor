import getTheme from '../../internal/theme/get-theme';

const ColorContrastChecker = require('color-contrast-checker');

describe('defaultColors', () => {
  describe('accessibility - WCAG AA', () => {
    const contrastCheck = new ColorContrastChecker();

    const lightTheme = getTheme({ mode: 'light' });
    const darkTheme = getTheme({ mode: 'dark' });
    const TEXT_SIZE = 12;

    function extraColorCode(colorString: string | undefined) {
      if (!colorString) {
        return '';
      }
      let colorRegx = /#(?:[0-9a-fA-F]{3}){1,2}/g;
      let matchColors = colorString.match(colorRegx);
      return matchColors ? matchColors[0] : colorString;
    }

    Object.entries({ lightTheme, darkTheme }).forEach(
      ([themeType, themeColorsObj]) => {
        describe(`${themeType} color palette passes minimum contrast rule`, () => {
          const {
            lineNumberBgColor,
            lineNumberColor,
            backgroundColor,
            highlightedLineBgColor,
            highlightedLineBorderColor,
            fontFamilyItalic: _,
            fontFamily: __,
            ...foregroundColors
          } = themeColorsObj;

          //extract color code
          let lineNumberBgColorCode = extraColorCode(lineNumberBgColor);
          let lineNumberColorCode = extraColorCode(lineNumberColor);
          let backgroundColorCode = extraColorCode(backgroundColor);
          let highlightedLineBgColorCode = extraColorCode(
            highlightedLineBgColor,
          );
          let highlightedLineBorderColorCode = extraColorCode(
            highlightedLineBorderColor,
          );

          it('line number colors are accessible', () => {
            const lineNumberContrastResult = contrastCheck.isLevelAA(
              lineNumberColorCode as string,
              lineNumberBgColorCode as string,
              TEXT_SIZE,
            );

            expect(lineNumberContrastResult).toBe(true);

            const lineNumberHighlightContrastResult = contrastCheck.isLevelAA(
              lineNumberColorCode as string,
              highlightedLineBgColorCode as string,
              TEXT_SIZE,
            );

            expect(lineNumberHighlightContrastResult).toBe(true);
          });

          it('highlight border color is accessible', () => {
            const lineNumberContrastResult = contrastCheck.isLevelCustom(
              highlightedLineBorderColorCode as string,
              highlightedLineBgColorCode as string,
              3.0, // UI elements only need a 3:1 ratio
            );

            expect(lineNumberContrastResult).toBe(true);
          });

          Object.values(foregroundColors).forEach((foregroundColor: string) => {
            // extra color code only
            foregroundColor = extraColorCode(foregroundColor);
            // normal
            it(`${foregroundColor} foreground color is accessible with ${backgroundColorCode} background color`, () => {
              const foregroundColorContrastResult = contrastCheck.isLevelAA(
                foregroundColor,
                backgroundColorCode as string,
                TEXT_SIZE,
              );

              expect(foregroundColorContrastResult).toBe(true);
            });

            // highlighted
            it(`${foregroundColor} foreground color is accessible with ${highlightedLineBgColorCode} highlighted background color`, () => {
              const highlightedLineContrastResult = contrastCheck.isLevelAA(
                foregroundColor as string,
                highlightedLineBgColorCode as string,
                TEXT_SIZE,
              );

              expect(highlightedLineContrastResult).toBe(true);
            });
          });
        });
      },
    );
  });
});
