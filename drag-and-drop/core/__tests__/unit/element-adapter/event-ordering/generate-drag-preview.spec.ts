import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '../../../../src/entry-point/adapter/element';
import { combine } from '../../../../src/entry-point/util/combine';
import { appendToBody, getBubbleOrderedTree } from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

it('should notify the source draggable, drop targets in bubble order, then monitors in bind order', () => {
  const [draggableEl, child, parent] = getBubbleOrderedTree();
  child.appendChild(draggableEl);
  parent.appendChild(child);
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(parent),
    monitorForElements({
      onGenerateDragPreview: () => ordered.push('monitor1'),
    }),
    dropTargetForElements({
      element: parent,
      onGenerateDragPreview: () => ordered.push('parent'),
    }),
    draggable({
      element: draggableEl,
      onGenerateDragPreview: () => ordered.push('draggable'),
    }),
    dropTargetForElements({
      element: child,
      onGenerateDragPreview: () => ordered.push('child'),
    }),
    monitorForElements({
      onGenerateDragPreview: () => ordered.push('monitor2'),
    }),
  );

  fireEvent.dragStart(draggableEl);

  expect(ordered).toEqual([
    // draggable source
    'draggable',
    // bubble ordered drop targets
    'child',
    'parent',
    // monitors ordered in bind order
    'monitor1',
    'monitor2',
  ]);

  cleanup();
});
