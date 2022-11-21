/** @jsx jsx */
import Popup from '@atlaskit/popup';
import { jsx } from '@emotion/react';
import React, { FC, useCallback, useRef } from 'react';
import { useSmartLinkActions } from '../../../state/hooks-external/useSmartLinkActions';
import { useSmartLinkRenderers } from '../../../state/renderers';
import { useSmartCardState as useLinkState } from '../../../state/store';
import HoverCardContent from '../components/HoverCardContent';
import { HoverCardContainer, CARD_GAP_PX } from '../styled';
import { HoverCardComponentProps } from '../types';
import { SMART_CARD_ANALYTICS_DISPLAY } from '../utils';

export const hoverCardClassName = 'smart-links-hover-preview';

export const HoverCardComponent: FC<HoverCardComponentProps> = ({
  children,
  url,
  analyticsHandler,
  analytics,
}) => {
  const delay = 300;
  const [isOpen, setIsOpen] = React.useState(false);
  const fadeOutTimeoutId = useRef<NodeJS.Timeout>();
  const fadeInTimeoutId = useRef<NodeJS.Timeout>();
  const cardOpenTime = useRef<number>();
  const mousePos = useRef<{ x: number; y: number }>();
  const popupOffset = useRef<[number, number]>();
  const parentSpan = useRef<HTMLSpanElement>(null);

  const renderers = useSmartLinkRenderers();
  const linkState = useLinkState(url);
  const hoverDisplay = 'card';
  const invokeMethod = 'mouse_hover';

  const setMousePosition = useCallback(
    (event) => {
      if (isOpen) {
        return;
      }
      mousePos.current = { x: event.clientX, y: event.clientY };
    },
    [isOpen],
  );

  const hideCard = useCallback(() => {
    //Check its previously open to avoid firing events when moving between the child and hover card components
    if (isOpen === true && cardOpenTime.current) {
      const hoverTime = Date.now() - cardOpenTime.current;
      analytics.ui.hoverCardDismissedEvent({
        previewDisplay: 'card',
        hoverTime,
        previewInvokeMethod: 'mouse_hover',
      });
    }
    setIsOpen(false);
  }, [analytics.ui, isOpen]);

  const initHideCard = useCallback(() => {
    if (fadeInTimeoutId.current) {
      clearTimeout(fadeInTimeoutId.current);
    }
    fadeOutTimeoutId.current = setTimeout(() => hideCard(), delay);
  }, [hideCard]);

  const initShowCard = useCallback(
    (event) => {
      if (fadeOutTimeoutId.current) {
        clearTimeout(fadeOutTimeoutId.current);
      }
      //Set mouse position in the case it's not already set by onMouseMove, as in the case of scrolling
      setMousePosition(event);
      fadeInTimeoutId.current = setTimeout(() => {
        //Check if its previously closed to avoid firing events when moving between the child and hover card components
        if (isOpen === false) {
          cardOpenTime.current = Date.now();
          analytics.ui.hoverCardViewedEvent({
            previewDisplay: hoverDisplay,
            previewInvokeMethod: invokeMethod,
          });
        }
        //If these are undefined then popupOffset is undefined and we fallback to default bottom-start placement
        if (parentSpan.current && mousePos.current) {
          const { bottom, left } = parentSpan.current.getBoundingClientRect();
          popupOffset.current = [
            mousePos.current.x - left,
            mousePos.current.y - bottom + CARD_GAP_PX,
          ];
        }
        setIsOpen(true);
      }, delay);
    },
    [isOpen, setMousePosition, analytics.ui],
  );

  const linkActions = useSmartLinkActions({
    url,
    appearance: SMART_CARD_ANALYTICS_DISPLAY,
    analyticsHandler,
    origin: 'smartLinkPreviewHoverCard',
  });
  const onActionClick = useCallback(
    (actionId) => {
      if (actionId === 'preview-content') {
        hideCard();
      }
    },
    [hideCard],
  );

  // Stop hover preview content to propagate event to parent.
  const onClick = useCallback((e) => e.stopPropagation(), []);

  return (
    <Popup
      testId="hover-card"
      isOpen={isOpen}
      onClose={hideCard}
      placement="bottom-start"
      offset={popupOffset.current}
      autoFocus={false}
      content={({ update }) => (
        <div
          onMouseEnter={initShowCard}
          onMouseLeave={initHideCard}
          onClick={onClick}
          css={HoverCardContainer}
          // class name for trello to exclude click events
          className={hoverCardClassName}
        >
          <HoverCardContent
            analytics={analytics}
            cardActions={linkActions}
            cardState={linkState}
            onActionClick={onActionClick}
            onResolve={update}
            renderers={renderers}
            url={url}
          />
        </div>
      )}
      trigger={(triggerProps) => (
        <span ref={parentSpan}>
          <span
            {...triggerProps}
            onMouseEnter={initShowCard}
            onMouseLeave={initHideCard}
            onMouseMove={setMousePosition}
          >
            {children}
          </span>
        </span>
      )}
      zIndex={511} // Temporary fix for Confluence inline comment on editor mod has z-index of 500, Jira issue view has z-index of 510
    />
  );
};
