import { fireEvent } from '@testing-library/dom';

import { draggable } from '../../../../src/entry-point/adapter/element';
import { combine } from '../../../../src/entry-point/util/combine';
import { appendToBody, getBubbleOrderedTree, userEvent } from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

it('should allow nested draggables', () => {
  const [child, parent] = getBubbleOrderedTree();
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(parent),
    draggable({
      element: parent,
      onDragStart: () => ordered.push('parent:start'),
      onDrop: () => ordered.push('parent:drop'),
    }),
    draggable({
      element: child,
      onDragStart: () => ordered.push('child:start'),
      onDrop: () => ordered.push('child:drop'),
    }),
  );

  // lets drag the child
  userEvent.lift(child);
  userEvent.drop(document.body);

  expect(ordered).toEqual(['child:start', 'child:drop']);
  ordered.length = 0;

  // now lets drag the parent
  userEvent.lift(parent);
  userEvent.drop(document.body);
  expect(ordered).toEqual(['parent:start', 'parent:drop']);

  cleanup();
});
