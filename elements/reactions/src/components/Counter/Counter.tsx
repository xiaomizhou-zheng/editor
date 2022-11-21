/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import {
  SlideIn,
  ExitingPersistence,
  mediumDurationMs,
} from '@atlaskit/motion';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports
import usePreviousValue from '@atlaskit/ds-lib/use-previous-value';
import { constants } from '../../shared';

import * as styles from './styles';

/**
 * Test id for component top level div
 */
export const RENDER_COMPONENT_WRAPPER = 'counter-wrapper';

/**
 * Test id for wrapper div of the counter inside the slider
 */
export const RENDER_COUNTER_TESTID = 'counter-container';

/**
 * Counter label value wrapper div
 */
export const RENDER_LABEL_TESTID = 'counter_label_wrapper';

export interface CounterProps {
  /**
   * Count of emoji been selected
   */
  value: number;
  /**
   * Has the emoji been selected by given user (defaults to false)
   */
  highlight?: boolean;
  /**
   * Max threshold of selections to show before having a label (defaults to 1000)
   */
  limit?: number;
  /**
   * Label to show when the value surpasses the limit value (defaults to "1k+")
   */
  overLimitLabel?: string;
  /**
   * Optional wrapper class name
   */
  className?: string;
  /**
   * Duration in ms of how long the motion will take (defaults to "mediumDurationMs" from '@atlaskit/motion')
   */
  animationDuration?: number;
}

export const getLabel = (
  value: number,
  overLimitLabel?: string,
  limit?: number,
) => {
  // Check if reached limit
  if (limit && value >= limit) {
    return overLimitLabel || '';
  } else if (value === 0) {
    return '';
  } else {
    return value.toString();
  }
};

/**
 * Display reaction count next to the emoji button
 */
export const Counter: React.FC<CounterProps> = ({
  highlight = false,
  limit = constants.DEFAULT_REACTION_TOP_LIMIT,
  overLimitLabel = constants.DEFAULT_OVER_THE_LIMIT_REACTION_LABEL,
  className,
  value,
  animationDuration = mediumDurationMs,
}) => {
  const previousValue = usePreviousValue(value);
  const label = getLabel(value, overLimitLabel, limit);
  const increase = previousValue ? previousValue < value : false;

  return (
    <div
      className={className}
      data-testid={RENDER_COMPONENT_WRAPPER}
      css={[styles.countStyle, { width: label.length * 7 }]}
    >
      <ExitingPersistence>
        <SlideIn
          enterFrom={increase ? 'bottom' : 'top'}
          key={value}
          duration={animationDuration}
        >
          {(motion, direction) => {
            return (
              <div
                ref={motion.ref}
                css={[
                  styles.containerStyle,
                  css({
                    position: direction === 'exiting' ? 'absolute' : undefined,
                  }),
                ]}
                className={motion.className}
                data-testid={RENDER_COUNTER_TESTID}
              >
                <div
                  data-testid={RENDER_LABEL_TESTID}
                  css={highlight && styles.highlightStyle}
                  key={value}
                >
                  {label}
                </div>
              </div>
            );
          }}
        </SlideIn>
      </ExitingPersistence>
    </div>
  );
};
