import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '../../../../src/entry-point/adapter/element';
import { combine } from '../../../../src/entry-point/util/combine';
import {
  appendToBody,
  getBubbleOrderedTree,
  getElements,
  userEvent,
} from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

const triggers = [
  {
    name: 'dragenter',
    fireOver: (element: Element) => fireEvent.dragEnter(element),
  },
  {
    name: 'dragover',
    fireOver: (element: Element) => fireEvent.dragOver(element),
  },
];

triggers.forEach(trigger => {
  describe(`update trigger: ${trigger.name}`, () => {
    test('scenario: [] -> [B, A]', () => {
      const [draggableEl, A, B] = getElements();
      A.appendChild(B);
      const ordered: string[] = [];

      const cleanup = combine(
        appendToBody(A, draggableEl),
        draggable({
          element: draggableEl,
          onDropTargetChange: () => ordered.push('draggable:update'),
        }),
        monitorForElements({
          onDropTargetChange: () => ordered.push('monitor:update'),
        }),
        dropTargetForElements({
          element: A,
          onDropTargetChange: () => ordered.push('a:update'),
          onDragEnter: () => ordered.push('a:enter'),
          onDragLeave: () => ordered.push('a:leave'),
        }),
        dropTargetForElements({
          element: B,
          onDropTargetChange: () => ordered.push('b:update'),
          onDragEnter: () => ordered.push('b:enter'),
          onDragLeave: () => ordered.push('b:leave'),
        }),
      );

      userEvent.lift(draggableEl);

      trigger.fireOver(B);

      // bubble ordering
      expect(ordered).toEqual([
        'draggable:update',
        'b:update',
        'b:enter',
        'a:update',
        'a:enter',
        'monitor:update',
      ]);

      cleanup();
    });

    test('scenario: [B, A] -> []', () => {
      const [draggableEl, A, B] = getElements();
      A.appendChild(B);
      B.appendChild(draggableEl);
      const started: string[] = [];
      const ordered: string[] = [];

      const cleanup = combine(
        appendToBody(A),
        draggable({
          element: draggableEl,
          onDragStart: () => started.push('draggable:start'),
          onDropTargetChange: () => ordered.push('draggable:update'),
        }),
        monitorForElements({
          onDragStart: () => started.push('monitor:start'),
          onDropTargetChange: () => ordered.push('monitor:update'),
        }),
        dropTargetForElements({
          element: A,
          onDragStart: () => started.push('a:start'),
          onDropTargetChange: () => ordered.push('a:update'),
          onDragEnter: () => ordered.push('a:enter'),
          onDragLeave: () => ordered.push('a:leave'),
        }),
        dropTargetForElements({
          element: B,
          onDragStart: () => started.push('b:start'),
          onDropTargetChange: () => ordered.push('b:update'),
          onDragEnter: () => ordered.push('b:enter'),
          onDragLeave: () => ordered.push('b:leave'),
        }),
      );

      userEvent.lift(draggableEl);

      // asserting start order [B, A]
      expect(started).toEqual([
        'draggable:start',
        'b:start',
        'a:start',
        'monitor:start',
      ]);

      // no update events yet
      expect(ordered).toEqual([]);

      // [B, A] -> []
      trigger.fireOver(document.body);

      expect(ordered).toEqual([
        'draggable:update',
        // starts by doing all events on previous drop targets
        'b:update',
        'b:leave',
        'a:update',
        'a:leave',
        'monitor:update',
      ]);

      cleanup();
    });

    test('scenario: [B, A] -> [C, A]', () => {
      const [draggableEl, B, A] = getBubbleOrderedTree();
      const [C] = getElements();
      A.appendChild(C);
      const ordered: string[] = [];

      const cleanup = combine(
        appendToBody(A),
        draggable({
          element: draggableEl,
          onDragStart: () => ordered.push('draggable:start'),
          onDropTargetChange: () => ordered.push('draggable:update'),
        }),
        monitorForElements({
          onDragStart: () => ordered.push('monitor:start'),
          onDropTargetChange: () => ordered.push('monitor:update'),
        }),
        dropTargetForElements({
          element: A,
          onDragStart: () => ordered.push('a:start'),
          onDropTargetChange: () => ordered.push('a:update'),
          onDragEnter: () => ordered.push('a:enter'),
          onDragLeave: () => ordered.push('a:leave'),
        }),
        dropTargetForElements({
          element: B,
          onDragStart: () => ordered.push('b:start'),
          onDropTargetChange: () => ordered.push('b:update'),
          onDragEnter: () => ordered.push('b:enter'),
          onDragLeave: () => ordered.push('b:leave'),
        }),
        dropTargetForElements({
          element: C,
          onDragStart: () => ordered.push('c:start'),
          onDropTargetChange: () => ordered.push('c:update'),
          onDragEnter: () => ordered.push('c:enter'),
          onDragLeave: () => ordered.push('c:leave'),
        }),
      );

      userEvent.lift(draggableEl);

      // asserting start order [B, A]
      expect(ordered).toEqual([
        'draggable:start',
        'b:start',
        'a:start',
        'monitor:start',
      ]);
      ordered.length = 0;

      // [B, A] -> [C, A]
      trigger.fireOver(C);

      expect(ordered).toEqual([
        'draggable:update',
        // starts by doing all events on previous drop targets
        'b:update',
        'b:leave',
        'a:update',
        // bubble order updates on new drop targets
        'c:update',
        'c:enter',
        'monitor:update',
      ]);

      cleanup();
    });

    test('scenario: [B, A] -> [D, C]', () => {
      const [draggableEl, B, A] = getBubbleOrderedTree();
      const [D, C] = getBubbleOrderedTree();
      const ordered: string[] = [];

      const cleanup = combine(
        appendToBody(A, C),
        draggable({
          element: draggableEl,
          onDragStart: () => ordered.push('draggable:start'),
          onDropTargetChange: () => ordered.push('draggable:update'),
        }),
        monitorForElements({
          onDragStart: () => ordered.push('monitor:start'),
          onDropTargetChange: () => ordered.push('monitor:update'),
        }),
        dropTargetForElements({
          element: A,
          onDragStart: () => ordered.push('a:start'),
          onDropTargetChange: () => ordered.push('a:update'),
          onDragEnter: () => ordered.push('a:enter'),
          onDragLeave: () => ordered.push('a:leave'),
        }),
        dropTargetForElements({
          element: B,
          onDragStart: () => ordered.push('b:start'),
          onDropTargetChange: () => ordered.push('b:update'),
          onDragEnter: () => ordered.push('b:enter'),
          onDragLeave: () => ordered.push('b:leave'),
        }),
        dropTargetForElements({
          element: C,
          onDragStart: () => ordered.push('c:start'),
          onDropTargetChange: () => ordered.push('c:update'),
          onDragEnter: () => ordered.push('c:enter'),
          onDragLeave: () => ordered.push('c:leave'),
        }),
        dropTargetForElements({
          element: D,
          onDragStart: () => ordered.push('d:start'),
          onDropTargetChange: () => ordered.push('d:update'),
          onDragEnter: () => ordered.push('d:enter'),
          onDragLeave: () => ordered.push('d:leave'),
        }),
      );

      userEvent.lift(draggableEl);

      // asserting start order [B, A]
      expect(ordered).toEqual([
        'draggable:start',
        'b:start',
        'a:start',
        'monitor:start',
      ]);
      ordered.length = 0;

      // [B, A] -> [D, C]
      trigger.fireOver(D);

      expect(ordered).toEqual([
        'draggable:update',
        // starts by doing all events on previous drop targets
        'b:update',
        'b:leave',
        'a:update',
        'a:leave',
        // bubble order updates on new drop targets
        'd:update',
        'd:enter',
        'c:update',
        'c:enter',
        'monitor:update',
      ]);

      cleanup();
    });

    test('scenario: [C, B] -> [C, B, A] (reparenting)', () => {
      // A won't be a added to DOM until later
      const [draggableEl, C, B, A] = getElements();
      B.appendChild(C);
      C.appendChild(draggableEl);
      A.id = 'A';
      B.id = 'B';
      C.id = 'C';
      const ordered: string[] = [];

      // not cleaning this up, as removing A will remove B too at the end
      appendToBody(B);

      const cleanup = combine(
        draggable({
          element: draggableEl,
          onDragStart: () => ordered.push('draggable:start'),
          onDropTargetChange: () => ordered.push('draggable:update'),
        }),
        monitorForElements({
          onDragStart: () => ordered.push('monitor:start'),
          onDropTargetChange: () => ordered.push('monitor:update'),
        }),
        dropTargetForElements({
          element: B,
          onDragStart: () => ordered.push('b:start'),
          onDropTargetChange: () => ordered.push('b:update'),
          onDragEnter: () => ordered.push('b:enter'),
          onDragLeave: () => ordered.push('b:leave'),
        }),
        dropTargetForElements({
          element: C,
          onDragStart: () => ordered.push('c:start'),
          onDropTargetChange: () => ordered.push('c:update'),
          onDragEnter: () => ordered.push('c:enter'),
          onDragLeave: () => ordered.push('c:leave'),
        }),
      );

      userEvent.lift(draggableEl);

      // asserting start order [B, A]
      expect(ordered).toEqual([
        'draggable:start',
        'c:start',
        'b:start',
        'monitor:start',
      ]);
      ordered.length = 0;

      const cleanup2 = combine(
        appendToBody(A),
        dropTargetForElements({
          element: A,
          onDragStart: () => ordered.push('a:start'),
          onDropTargetChange: () => ordered.push('a:update'),
          onDragEnter: () => ordered.push('a:enter'),
          onDragLeave: () => ordered.push('a:leave'),
        }),
      );
      // Setting A as new parent of B
      A.appendChild(B);

      // asserting we go the hierarchy right
      expect(document.body.innerHTML).toEqual(
        `<div id="A" data-drop-target-for-element="true"><div id="B" data-drop-target-for-element="true"><div id="C" data-drop-target-for-element="true"><div draggable="true"></div></div></div></div>`,
      );

      // [C, B] -> [C, B, A] (reparenting)
      trigger.fireOver(C);

      expect(ordered).toEqual([
        'draggable:update',
        'c:update',
        'b:update',
        'a:update',
        'a:enter',
        'monitor:update',
      ]);

      cleanup();
      cleanup2();
    });
  });
});
