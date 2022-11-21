/** @jsx jsx */
import { Fragment, ReactNode, useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { token } from '@atlaskit/tokens';

import {
  draggable,
  dropTargetForElements,
} from '../src/entry-point/adapter/element';
import { scrollJustEnoughIntoView } from '../src/util/scroll-just-enough-into-view';

import { fallbackColor } from './_util/fallback';
import { GlobalStyles } from './_util/global-styles';

const cardHeight = 48;
const numCards = 3;

const cardStyles = css({
  height: cardHeight,
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  boxShadow: token('elevation.shadow.raised', fallbackColor),
  background: token('elevation.surface.raised', fallbackColor),
  width: '100%',
  justifyContent: 'center',
  borderRadius: 'var(--border-radius)',
});

const containerStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  /**
   * This is intentionally too small to fit all of the cards,
   * so that we can test the scrollJustEnoughIntoView behavior.
   */
  height: (cardHeight * numCards) / 2,
  gap: 'var(--grid)',
  overflow: 'auto',
  width: 240,
  margin: '0 auto',
  padding: 'var(--grid)',
});

function Draggable({ testId }: { testId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return draggable({
      element,
      onGenerateDragPreview() {
        scrollJustEnoughIntoView({ element });
      },
    });
  }, []);

  return (
    <div ref={ref} css={cardStyles} data-testid={testId}>
      {testId}
    </div>
  );
}

function DropTarget({
  children,
  testId,
}: {
  children: ReactNode;
  testId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return dropTargetForElements({
      element,
    });
  }, []);

  return (
    <div ref={ref} css={containerStyles} data-testid={testId}>
      {children}
    </div>
  );
}

export default function Example() {
  return (
    <Fragment>
      <GlobalStyles />
      <DropTarget testId="container">
        {Array.from({ length: numCards }, (_, index) => {
          return <Draggable key={index} testId={`card-${index}`} />;
        })}
      </DropTarget>
    </Fragment>
  );
}
