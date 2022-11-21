/** @jsx jsx */
import { forwardRef, Ref } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';

import { gridSize } from '../../common/constants';
import { useTheme } from '../../theme';

import { getPrimaryButtonTheme } from './styles';
import { PrimaryButtonProps } from './types';

const VAR_BUTTON_SELECTED_COLOR = '--button-selected-color';
const VAR_BUTTON_SELECTED_BORDER_COLOR = '--button-selected-border-color';

const buttonBaseStyles = css({
  display: 'flex',
  height: '100%',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const buttonHighlightedStyles = css({
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '&& > *': {
    color: `var(${VAR_BUTTON_SELECTED_COLOR})`,
  },

  '&:after': {
    height: 3,
    position: 'absolute',
    right: gridSize / 2,
    bottom: 0,
    left: gridSize / 2,
    backgroundColor: `var(${VAR_BUTTON_SELECTED_BORDER_COLOR})`,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    content: '""',
  },
});

/**
 * __Primary button__
 *
 * A primary button allows you to add top-level navigation items.
 * Should be passed into `AtlassianNavigation`'s `primaryItems` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#dropdown-menu)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const PrimaryButton = forwardRef<HTMLElement, PrimaryButtonProps>(
  (props: PrimaryButtonProps, ref: Ref<HTMLElement>) => {
    const {
      children,
      testId,
      tooltip,
      isSelected,
      isHighlighted,
      ...buttonProps
    } = props;
    const theme = useTheme();

    const button = (
      <div
        style={
          {
            [VAR_BUTTON_SELECTED_COLOR]:
              theme.mode.primaryButton.selected.color,
            [VAR_BUTTON_SELECTED_BORDER_COLOR]:
              theme.mode.primaryButton.selected.borderColor,
          } as React.CSSProperties
        }
        css={[buttonBaseStyles, isHighlighted && buttonHighlightedStyles]}
      >
        <Button
          appearance="primary"
          testId={testId}
          ref={ref}
          isSelected={isSelected}
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          theme={getPrimaryButtonTheme(theme)}
          {...buttonProps}
        >
          {children}
        </Button>
      </div>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} hideTooltipOnClick>
          {button}
        </Tooltip>
      );
    }

    return button;
  },
);

export default PrimaryButton;
