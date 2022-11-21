/** @jsx jsx */

import { useCallback, useRef } from 'react';

import { jsx } from '@emotion/react';

import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import {
  ExitingPersistence,
  SlideIn,
  Transition,
  useExitingPersistence,
} from '@atlaskit/motion';
import type { SlideInProps } from '@atlaskit/motion/types';

import { animationTimingFunction, transitionDurationMs } from '../../constants';
import {
  DrawerPrimitiveDefaults,
  DrawerPrimitiveOverrides,
  DrawerPrimitiveProps,
} from '../types';
import { createExtender } from '../utils';

import ContentOverrides from './content';
import DrawerWrapper from './drawer-wrapper';
import FocusLock from './focus-lock';
import IconButton from './icon-button';
import SidebarOverrides from './sidebar';

// Misc.
// ------------------------------

const defaults: DrawerPrimitiveDefaults = {
  Sidebar: SidebarOverrides,
  Content: ContentOverrides,
};

/**
 * This wrapper is used to specify separate durations for enter and exit.
 */
const CustomSlideIn = ({
  children,
  onFinish,
}: Pick<SlideInProps, 'children' | 'onFinish'>) => {
  const { isExiting } = useExitingPersistence();

  /**
   * The actual duration should be the same for both enter and exit,
   * but motion halves the passed duration for exit animations,
   * so we double it when exiting.
   */
  const duration = isExiting ? transitionDurationMs * 2 : transitionDurationMs;

  return (
    <SlideIn
      animationTimingFunction={animationTimingFunction}
      duration={duration}
      enterFrom="left"
      exitTo="left"
      fade="none"
      onFinish={onFinish}
    >
      {children}
    </SlideIn>
  );
};

const DrawerPrimitive = ({
  children,
  icon: Icon,
  onClose,
  onCloseComplete,
  onOpenComplete,
  overrides,
  testId,
  in: isOpen,
  shouldReturnFocus,
  autoFocusFirstElem,
  isFocusLockEnabled,
  width,
}: DrawerPrimitiveProps) => {
  const getOverrides = createExtender<
    DrawerPrimitiveDefaults,
    DrawerPrimitiveOverrides
  >(defaults, overrides);

  const { component: Sidebar, ...sideBarOverrides } = getOverrides('Sidebar');
  const { component: Content, ...contentOverrides } = getOverrides('Content');

  /**
   * A ref to point to our wrapper, passed to `onCloseComplete` and `onOpenComplete` callbacks.
   */
  const drawerRef = useRef<HTMLDivElement>(null);

  const onFinish = useCallback(
    (state: Transition) => {
      if (state === 'entering') {
        onOpenComplete?.(drawerRef.current);
      } else if (state === 'exiting') {
        onCloseComplete?.(drawerRef.current);
      }
    },
    [onCloseComplete, onOpenComplete],
  );

  return (
    <ExitingPersistence appear>
      {isOpen && (
        <CustomSlideIn onFinish={onFinish}>
          {({ className }) => (
            <FocusLock
              autoFocusFirstElem={autoFocusFirstElem}
              isFocusLockEnabled={isFocusLockEnabled}
              shouldReturnFocus={shouldReturnFocus}
            >
              <DrawerWrapper
                className={className}
                width={width}
                testId={testId}
                drawerRef={drawerRef}
              >
                <Sidebar {...sideBarOverrides}>
                  <IconButton
                    onClick={onClose}
                    testId={testId && 'DrawerPrimitiveSidebarCloseButton'}
                  >
                    {Icon ? (
                      <Icon size="large" />
                    ) : (
                      <ArrowLeft label="Close drawer" />
                    )}
                  </IconButton>
                </Sidebar>

                <Content {...contentOverrides}>{children}</Content>
              </DrawerWrapper>
            </FocusLock>
          )}
        </CustomSlideIn>
      )}
    </ExitingPersistence>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DrawerPrimitive;
