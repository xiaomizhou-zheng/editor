/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react';
import { render } from '@testing-library/react';

import { CustomThemeButton, CustomThemeButtonProps } from '../../../index';
import { hasStyleRule } from '../_util/style-rules';

const additions: CSSObject = {
  width: '100px',
  height: '200px',
  margin: '20px',
};

const OurButton = (props: CustomThemeButtonProps) => (
  <CustomThemeButton
    testId="button"
    // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
    theme={(current, themeProps) => {
      const { buttonStyles, spinnerStyles } = current(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          ...additions,
        },
        spinnerStyles: spinnerStyles,
      };
    }}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
  />
);

it('should render button styles defined in custom theme', () => {
  const { getByTestId } = render(<OurButton />);

  const button = getByTestId('button');

  expect(hasStyleRule(`.${button.className}`, additions)).toBe(true);
});

it('should render button styles defined in ADG theme if no custom theme passed in', () => {
  const { getByTestId } = render(<CustomThemeButton testId="button" />);

  const button = getByTestId('button');

  expect(hasStyleRule(`.${button.className}`, { display: 'inline-flex' })).toBe(
    true,
  );
});
