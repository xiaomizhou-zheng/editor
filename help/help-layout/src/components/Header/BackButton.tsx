import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import { gridSize } from '@atlaskit/theme/constants';
import { Transition } from 'react-transition-group';
import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left';
import Button from '@atlaskit/button/standard-button';

import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import { messages } from '../../messages';

import { TRANSITION_DURATION_MS, TRANSITION_STATUS } from '../constants';

import { BackButtonContainer } from './styled';

interface Props {
  // Function executed when the user press the "Back" button.
  onClick(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Defines if the back button is visible
  isVisible?: boolean;
}

// Animation
const defaultStyle = {
  transition: `left ${TRANSITION_DURATION_MS}ms, opacity ${TRANSITION_DURATION_MS}ms`,
  left: `${gridSize() * 3}px`,
  opacity: 0,
};
const transitionStyles: { [id: string]: React.CSSProperties } = {
  entered: { left: `${gridSize()}px`, opacity: 1 },
  exited: { left: `${gridSize()}px`, opacity: 0 },
};

export const BackButton: React.FC<Props & WrappedComponentProps> = ({
  onClick,
  isVisible = true,
  intl: { formatMessage },
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleOnClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ): void => {
    if (onClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'clicked',
      });
      onClick(event, analyticsEvent);
    }
  };

  return (
    <Transition
      in={isVisible}
      timeout={TRANSITION_DURATION_MS}
      mountOnEnter
      unmountOnExit
    >
      {(state: TRANSITION_STATUS) => (
        <BackButtonContainer
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          <Button
            onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
              if (state === 'entered') {
                handleOnClick(event);
              }
            }}
            appearance="subtle"
            iconBefore={<ArrowleftIcon label="" size="medium" />}
          >
            {formatMessage(messages.help_panel_header_back)}
          </Button>
        </BackButtonContainer>
      )}
    </Transition>
  );
};

const BackButtonWithContext: React.FC<Props & WrappedComponentProps> = (
  props,
) => {
  return (
    <AnalyticsContext
      data={{
        componentName: 'backButton',
        packageName,
        packageVersion,
      }}
    >
      <BackButton {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(BackButtonWithContext);
