import { gridSize, fontFamily } from '@atlaskit/theme/constants';
import {
  B100,
  B400,
  B50,
  G400,
  N0,
  N20,
  N200,
  N30,
  N300,
  N40,
  N500,
  N70,
  N800,
  R400,
  R75,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { StylesConfig, ValidationState } from './types';

const BORDER_WIDTH = 2;
const ICON_PADDING = 2;
const paddingExcludingBorder = gridSize() - BORDER_WIDTH;

export default function baseStyles<Option, IsMulti extends boolean>(
  validationState: ValidationState,
  isCompact: boolean = false,
  appearance: 'default' | 'subtle' | 'none',
): StylesConfig<Option, IsMulti> {
  return {
    container: (css, { isDisabled }) => ({
      ...css,
      fontFamily: fontFamily(),
      // react-select disables pointer events when isDisabled is true.
      // We override this and make the inner container turn it off instead.
      pointerEvents: 'all',
      cursor: isDisabled ? 'not-allowed' : css.cursor,
    }),
    input: (css) => ({
      ...css,
      color: token('color.text', 'hsl(0, 0%, 20%)'),
    }),
    control: (css, { isFocused, isDisabled }) => {
      let borderColor: string = isFocused
        ? token('color.border.focused', B100)
        : token('color.border.input', N20);
      let backgroundColor: string = isFocused
        ? token('color.background.input.pressed', N0)
        : token('color.background.input', N20);
      let backgroundColorHover: string = isFocused
        ? token('color.background.input.pressed', N0)
        : token('color.background.input.hovered', N30);

      if (isDisabled) {
        backgroundColor = token('color.background.disabled', N20);
        borderColor = token('color.background.disabled', N20);
      }
      if (validationState === 'error') {
        borderColor = token('color.border.danger', R400);
      }
      if (validationState === 'success') {
        borderColor = token('color.border.success', G400);
      }

      let borderColorHover: string = isFocused
        ? token('color.border.focused', B100)
        : token('color.border.input', N30);

      if (validationState === 'error') {
        borderColorHover = token('color.border.danger', R400);
      }
      if (validationState === 'success') {
        borderColorHover = token('color.border.success', G400);
      }

      const transitionDuration = '200ms';

      if (appearance === 'subtle') {
        borderColor = isFocused
          ? token('color.border.focused', B100)
          : 'transparent';
        backgroundColor = isFocused
          ? token('elevation.surface', N0)
          : 'transparent';
        backgroundColorHover = isFocused
          ? token('color.background.input.pressed', N0)
          : token('color.background.input.hovered', N30);
      }
      if (appearance === 'none') {
        borderColor = 'transparent';
        backgroundColor = 'transparent';
        backgroundColorHover = 'transparent';
        borderColorHover = 'transparent';
      }

      return {
        ...css,
        // Turn pointer events off when disabled - this makes it so hover etc don't work.
        pointerEvents: isDisabled ? 'none' : undefined,
        backgroundColor,
        borderColor,
        borderStyle: 'solid',
        borderRadius: '3px',
        borderWidth: '2px',
        boxShadow: 'none',
        minHeight: isCompact ? gridSize() * 4 : gridSize() * 5,
        padding: 0,
        transition: `background-color ${transitionDuration} ease-in-out,
        border-color ${transitionDuration} ease-in-out`,
        '::-webkit-scrollbar': {
          height: gridSize(),
          width: gridSize(),
        },
        '::-webkit-scrollbar-corner': {
          display: 'none',
        },
        ':hover': {
          '::-webkit-scrollbar-thumb': {
            // scrollbars occur only if the user passes in a custom component with overflow: scroll
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
          cursor: 'pointer',
          backgroundColor: backgroundColorHover,
          borderColor: borderColorHover,
        },
        '::-webkit-scrollbar-thumb:hover': {
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          backgroundColor: 'rgba(0,0,0,0.4)',
        },
      };
    },
    valueContainer: (css) => ({
      ...css,
      paddingLeft: paddingExcludingBorder,
      paddingRight: paddingExcludingBorder,
      paddingBottom: isCompact ? 0 : 2,
      paddingTop: isCompact ? 0 : 2,
    }),
    clearIndicator: (css) => ({
      ...css,
      color: token('color.text.subtlest', N70),
      paddingLeft: ICON_PADDING,

      paddingRight: ICON_PADDING,

      paddingBottom: isCompact ? 0 : 6,

      paddingTop: isCompact ? 0 : 6,

      ':hover': {
        color: token('color.text.subtle', N500),
      },
    }),
    loadingIndicator: (css) => ({
      ...css,
      paddingBottom: isCompact ? 0 : 6,
      paddingTop: isCompact ? 0 : 6,
    }),
    dropdownIndicator: (css, { isDisabled }) => {
      let color: string = token('color.text.subtle', N500);

      if (isDisabled) {
        color = token('color.text.disabled', N70);
      }

      return {
        ...css,
        color,
        paddingLeft: ICON_PADDING,
        paddingRight: ICON_PADDING,
        paddingBottom: isCompact ? 0 : 6,
        paddingTop: isCompact ? 0 : 6,
        ':hover': {
          color: token('color.text.subtle', N200),
        },
      };
    },
    indicatorsContainer: (css) => ({
      ...css,
      paddingRight: paddingExcludingBorder - ICON_PADDING,
    }),
    option: (css, { isFocused, isSelected, isDisabled }) => {
      let color: string = token('color.text', N800);
      if (isDisabled) {
        color = token('color.text.disabled', N70);
      } else if (isSelected) {
        color = token('color.text.selected', B400);
      }

      let boxShadow;
      let backgroundColor;
      if (isDisabled) {
        backgroundColor = undefined;
      } else if (isSelected && isFocused) {
        backgroundColor = token('color.background.selected.hovered', B50);
      } else if (isSelected) {
        backgroundColor = token('color.background.selected', B50);
      } else if (isFocused) {
        backgroundColor = token('color.background.neutral.subtle.hovered', N20);
      }
      if (!isDisabled && (isFocused || isSelected)) {
        boxShadow = `inset 2px 0px 0px ${token('color.border.selected', B400)}`;
      }

      const cursor = isDisabled ? 'not-allowed' : css.cursor;

      return {
        ...css,
        padding: '6px 12px',
        backgroundColor,
        color,
        cursor,
        boxShadow,
        ':active': {
          backgroundColor: !isDisabled
            ? isSelected
              ? token('color.background.selected.pressed', N20)
              : token('color.background.neutral.subtle.pressed', N30)
            : undefined,
        },
        '@media screen and (-ms-high-contrast: active)': {
          borderLeft:
            !isDisabled && (isFocused || isSelected)
              ? '2px solid transparent'
              : '',
        },
      };
    },
    placeholder: (css, { isDisabled }) => ({
      ...css,
      color: isDisabled
        ? token('color.text.disabled', N300)
        : token('color.text.subtlest', N300),
    }),
    singleValue: (css, { isDisabled }) => ({
      ...css,
      color: isDisabled
        ? token('color.text.disabled', N70)
        : token('color.text', N800),
      lineHeight: `${gridSize() * 2}px`, // 16px
    }),
    menu: (css) => ({
      ...css,
      backgroundColor: token('elevation.surface.overlay', 'white'),
      boxShadow: token(
        'elevation.shadow.overlay',
        '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
      ),
    }),
    menuList: (css) => ({
      ...css,
      paddingTop: gridSize(),
      paddingBottom: gridSize(),
    }),
    multiValue: (css, { isFocused }) => ({
      ...css,
      borderRadius: '2px',
      backgroundColor: isFocused
        ? token('color.background.selected', N40)
        : token('color.background.neutral', N40),
      boxShadow: isFocused
        ? `0 0 0 2px ${token(
            'elevation.surface',
            'transparent',
          )}, 0 0 0 4px ${token('color.border.focused', 'transparent')}`
        : 'none',
      maxWidth: '100%',
      '@media screen and (-ms-high-contrast: active)': {
        border: isFocused ? '1px solid transparent' : 'none',
      },

      color: isFocused
        ? token('color.text.selected', 'hsl(0, 0%, 20%)')
        : token('color.text', 'hsl(0, 0%, 20%)'),
    }),
    multiValueLabel: (css, { isFocused }) => ({
      ...css,
      padding: '2px',
      color: 'inherit',
      paddingRight: '2px',
    }),
    multiValueRemove: (
      css,
      {
        // @ts-ignore: missing in @types/react-select
        isFocused,
      },
    ) => ({
      ...css,
      backgroundColor:
        isFocused && token('utility.UNSAFE_util.transparent', R75),
      fill: isFocused
        ? token('color.text.selected', '#000')
        : token('color.text', '#000'),
      paddingLeft: '2px',
      paddingRight: '2px',
      borderRadius: '0px 2px 2px 0px',

      // DSP-6470 we should style like Tag once we have the :has selector
      ':hover': {
        backgroundColor: token('color.background.danger.hovered', R75),
        fill: token('color.text.danger', '#000'),
      },
      ':active': {
        backgroundColor: token('color.background.danger.pressed', R75),
        fill: token('color.text.danger', '#000'),
      },
    }),
  };
}
