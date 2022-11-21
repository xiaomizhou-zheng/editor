import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  monitorForElements,
} from '../../../../src/entry-point/adapter/element';
import { CleanupFn } from '../../../../src/entry-point/types';
import { combine } from '../../../../src/entry-point/util/combine';
import { appendToBody, getElements } from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

it('should not call a new monitor for an active event', () => {
  const ordered: string[] = [];
  const [A] = getElements();

  const cleanups: CleanupFn[] = [];
  const cleanup = combine(
    appendToBody(A),
    draggable({ element: A }),
    monitorForElements({
      onGenerateDragPreview: () => {
        ordered.push('first:preview');
        const cleanupSecond = monitorForElements({
          onGenerateDragPreview: () => {
            ordered.push('second:preview');
          },
          // the monitor will be called for the next event
          onDragStart: () => {
            ordered.push('second:start');
          },
        });
        cleanups.push(cleanupSecond);
      },
      onDragStart: () => ordered.push('first:start'),
    }),
  );
  cleanups.push(cleanup);

  fireEvent.dragStart(A);

  expect(ordered).toEqual(['first:preview']);
  ordered.length = 0;

  // @ts-ignore
  requestAnimationFrame.step();

  expect(ordered).toEqual(['first:start', 'second:start']);
  ordered.length = 0;

  // finishing the first drag
  fireEvent.dragEnd(window);

  // starting another drag
  fireEvent.dragStart(A);

  // on the next drag, the new monitor has it's `onGenerateDragPreview` function called
  expect(ordered).toEqual(['first:preview', 'second:preview']);

  cleanups.forEach(fn => fn());
});
