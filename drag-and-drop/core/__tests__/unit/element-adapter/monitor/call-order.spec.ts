import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  monitorForElements,
} from '../../../../src/entry-point/adapter/element';
import { combine } from '../../../../src/entry-point/util/combine';
import { appendToBody } from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

it('should call monitors in order in which they where bound', () => {
  const draggableEl = document.createElement('div');
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(draggableEl),
    draggable({ element: draggableEl }),
    monitorForElements({
      onGenerateDragPreview: () => ordered.push('monitor1'),
    }),
    monitorForElements({
      onGenerateDragPreview: () => ordered.push('monitor2'),
    }),
  );

  fireEvent.dragStart(draggableEl);

  expect(ordered).toEqual([
    // monitors ordered in bind order
    'monitor1',
    'monitor2',
  ]);

  cleanup();
});

it('should monitors in latest bind order', () => {
  const draggableEl = document.createElement('div');
  const ordered: string[] = [];
  const cleanupBody = appendToBody(draggableEl);
  const cleanupDraggable = draggable({ element: draggableEl });
  const cleanupMonitor1 = monitorForElements({
    onGenerateDragPreview: () => ordered.push('monitor1'),
  });
  const cleanupMonitor2 = monitorForElements({
    onGenerateDragPreview: () => ordered.push('monitor2'),
  });

  // unbind first monitor
  cleanupMonitor1();
  // add another monitor
  const cleanupMonitor3 = monitorForElements({
    onGenerateDragPreview: () => ordered.push('monitor3'),
  });

  fireEvent.dragStart(draggableEl);

  expect(ordered).toEqual([
    // monitors ordered in bind order
    'monitor2',
    'monitor3',
  ]);

  cleanupBody();
  cleanupDraggable();
  cleanupMonitor2();
  cleanupMonitor3();
});
