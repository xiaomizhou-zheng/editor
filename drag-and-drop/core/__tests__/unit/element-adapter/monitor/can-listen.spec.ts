import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  dropTargetForElements,
  ElementMonitorCanMonitorArgs,
  monitorForElements,
} from '../../../../src/entry-point/adapter/element';
import { combine } from '../../../../src/entry-point/util/combine';
import {
  appendToBody,
  getDefaultInput,
  getElements,
  userEvent,
} from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

it('should publish events on active monitors during a drag', () => {
  const draggableEl = document.createElement('div');
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(draggableEl),
    draggable({ element: draggableEl }),
    monitorForElements({
      canMonitor: () => true,
      onGenerateDragPreview: () => ordered.push('monitor1'),
    }),
    monitorForElements({
      canMonitor: () => false,
      onGenerateDragPreview: () => ordered.push('monitor2'),
    }),
  );

  fireEvent.dragStart(draggableEl);

  expect(ordered).toEqual(['monitor1']);

  cleanup();
});

it('should only call canMonitor() at the start of a drag for mounted monitors', () => {
  const [A] = getElements();
  const ordered: string[] = [];
  const canMonitor = jest.fn(() => true);

  const cleanup = combine(
    appendToBody(A),
    draggable({ element: A }),
    dropTargetForElements({ element: A }),
    monitorForElements({
      canMonitor: canMonitor,
      onGenerateDragPreview: () => ordered.push('monitor:preview'),
      onDragStart: () => ordered.push('monitor:start'),
      onDrag: () => ordered.push('monitor:drag'),
      onDropTargetChange: () => ordered.push('monitor:change'),
      onDrop: () => ordered.push('monitor:drop'),
    }),
  );

  // doing a few drag operations to see that `canMonitor` is only called once per operation
  for (let i = 0; i < 5; i++) {
    // lifting in [A]
    expect(canMonitor).toBeCalledTimes(0);
    fireEvent.dragStart(A);
    expect(canMonitor).toBeCalledTimes(1);
    canMonitor.mockClear();
    expect(ordered).toEqual(['monitor:preview']);
    ordered.length = 0;

    // finish lift
    // @ts-expect-error
    requestAnimationFrame.step();
    expect(ordered).toEqual(['monitor:start']);
    ordered.length = 0;

    // [A] -> []
    fireEvent.dragEnter(document.body);
    expect(ordered).toEqual(['monitor:change']);
    ordered.length = 0;

    // dragging over []
    fireEvent.dragOver(document.body);
    // @ts-expect-error
    requestAnimationFrame.step();
    expect(ordered).toEqual(['monitor:drag']);
    ordered.length = 0;

    // cancel
    fireEvent.dragEnd(document.body);
    expect(ordered).toEqual(['monitor:drop']);
    ordered.length = 0;

    expect(canMonitor).toBeCalledTimes(0);
  }

  cleanup();
});

it('should allow canMonitor() to return different results between drags', () => {
  const [A] = getElements();
  const ordered: string[] = [];
  let canMonitor: boolean = false;

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('draggable:preview'),
      onDrop: () => ordered.push('draggable:drop'),
    }),
    dropTargetForElements({ element: A }),
    monitorForElements({
      canMonitor: () => canMonitor,
      onGenerateDragPreview: () => ordered.push('monitor:preview'),
      onDrop: () => ordered.push('monitor:drop'),
    }),
  );

  // drag1: lifting in [A]
  fireEvent.dragStart(A);
  expect(ordered).toEqual(['draggable:preview']);
  ordered.length = 0;

  // finishing drag1
  fireEvent.dragEnd(window);
  expect(ordered).toEqual(['draggable:drop']);
  ordered.length = 0;

  // drag2: lifting in [A] again, but allowing monitoring this time
  canMonitor = true;
  fireEvent.dragStart(A);
  expect(ordered).toEqual(['draggable:preview', 'monitor:preview']);
  ordered.length = 0;

  // finishing drag1
  fireEvent.dragEnd(window);
  expect(ordered).toEqual(['draggable:drop', 'monitor:drop']);

  cleanup();
});

it('should allow monitors to be added during a drag', () => {
  const [A] = getElements();
  const ordered: string[] = [];
  const cleanupA = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('a:preview'),
      onDragStart: () => ordered.push('a:start'),
      onDrag: () => ordered.push('a:drag'),
      onDropTargetChange: () => ordered.push('a:change'),
      onDrop: () => ordered.push('a:drop'),
    }),
    dropTargetForElements({ element: A }),
  );

  // lifting in [A]
  userEvent.lift(A);
  expect(ordered).toEqual(['a:preview', 'a:start']);
  ordered.length = 0;

  // now adding monitor
  const cleanupMonitor = monitorForElements({
    onGenerateDragPreview: () => ordered.push('monitor:preview'),
    onDragStart: () => ordered.push('monitor:start'),
    onDrag: () => ordered.push('monitor:drag'),
    onDropTargetChange: () => ordered.push('monitor:change'),
    onDrop: () => ordered.push('monitor:drop'),
  });

  // [A] -> []
  fireEvent.dragEnter(document.body);
  expect(ordered).toEqual(['a:change', 'monitor:change']);
  ordered.length = 0;

  // dragging over []
  fireEvent.dragOver(document.body);
  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual(['a:drag', 'monitor:drag']);
  ordered.length = 0;

  // cancel
  fireEvent.dragEnd(document.body);
  expect(ordered).toEqual(['a:drop', 'monitor:drop']);
  ordered.length = 0;

  cleanupA();
  cleanupMonitor();
});

it('should allow monitors to be removed during a drag', () => {
  const [A] = getElements();
  const ordered: string[] = [];

  const cleanupA = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('a:preview'),
      onDragStart: () => ordered.push('a:start'),
      onDrag: () => ordered.push('a:drag'),
      onDropTargetChange: () => ordered.push('a:change'),
      onDrop: () => ordered.push('a:drop'),
    }),
    dropTargetForElements({ element: A }),
  );
  const cleanupMonitor = monitorForElements({
    onGenerateDragPreview: () => ordered.push('monitor:preview'),
    onDragStart: () => ordered.push('monitor:start'),
    onDrag: () => ordered.push('monitor:drag'),
    onDropTargetChange: () => ordered.push('monitor:change'),
    onDrop: () => ordered.push('monitor:drop'),
  });

  // lifting in [A]
  userEvent.lift(A);
  expect(ordered).toEqual([
    'a:preview',
    'monitor:preview',
    'a:start',
    'monitor:start',
  ]);
  ordered.length = 0;

  // now removing monitor
  cleanupMonitor();

  // [A] -> []
  fireEvent.dragEnter(document.body);
  expect(ordered).toEqual(['a:change']);
  ordered.length = 0;

  // dragging over []
  fireEvent.dragOver(document.body);
  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual(['a:drag']);
  ordered.length = 0;

  // cancel
  fireEvent.dragEnd(document.body);
  expect(ordered).toEqual(['a:drop']);
  ordered.length = 0;

  cleanupA();
  cleanupMonitor();
});

it('should publish events to monitors added during a drag if on the next event they say they can monitor events', () => {
  const [A] = getElements();
  const ordered: string[] = [];
  const canMonitor = jest.fn(() => true);

  const cleanupA = combine(
    appendToBody(A),
    draggable({
      element: A,
      getInitialData: () => ({ name: 'Alex' }),
      onGenerateDragPreview: () => ordered.push('a:preview'),
      onDragStart: () => ordered.push('a:start'),
      onDrag: () => ordered.push('a:drag'),
      onDropTargetChange: () => ordered.push('a:change'),
      onDrop: () => ordered.push('a:drop'),
    }),
    dropTargetForElements({ element: A, getData: () => ({ name: 'Sam' }) }),
  );

  // lifting in [A]
  const initialInput = getDefaultInput({ clientX: 20 });
  userEvent.lift(A, initialInput);
  expect(ordered).toEqual(['a:preview', 'a:start']);
  ordered.length = 0;

  // new monitor not called yet
  expect(canMonitor).not.toHaveBeenCalled();

  // now adding monitor
  const cleanupMonitor = monitorForElements({
    canMonitor: canMonitor,
    onGenerateDragPreview: () => ordered.push('monitor:preview'),
    onDragStart: () => ordered.push('monitor:start'),
    onDrag: () => ordered.push('monitor:drag'),
    onDropTargetChange: () => ordered.push('monitor:change'),
    onDrop: () => ordered.push('monitor:drop'),
  });
  {
    expect(canMonitor).toHaveBeenCalledTimes(1);
    const expected: ElementMonitorCanMonitorArgs = {
      source: {
        element: A,
        data: { name: 'Alex' },
        dragHandle: null,
      },
      initial: {
        input: initialInput,
        dropTargets: [
          {
            element: A,
            dropEffect: 'move',
            data: { name: 'Sam' },
            sticky: false,
          },
        ],
      },
    };
    expect(canMonitor).toHaveBeenCalledWith(expected);
    canMonitor.mockClear();
  }

  // [A] -> []
  const dragEnterInput = getDefaultInput({ clientX: 10 });
  fireEvent.dragEnter(document.body, dragEnterInput);
  expect(ordered).toEqual(['a:change', 'monitor:change']);
  ordered.length = 0;

  // dragging over []
  fireEvent.dragOver(document.body);
  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual(['a:drag', 'monitor:drag']);
  ordered.length = 0;

  // cancel
  fireEvent.dragEnd(document.body);
  expect(ordered).toEqual(['a:drop', 'monitor:drop']);
  ordered.length = 0;
  expect(canMonitor).toHaveBeenCalledTimes(0);

  cleanupA();
  cleanupMonitor();
});

it('should not publish events to monitors added during a drag if they say they cannot monitor events', () => {
  const [A] = getElements();
  const ordered: string[] = [];
  const canMonitor = jest.fn(() => false);

  const cleanupA = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('a:preview'),
      onDragStart: () => ordered.push('a:start'),
      onDrag: () => ordered.push('a:drag'),
      onDropTargetChange: () => ordered.push('a:change'),
      onDrop: () => ordered.push('a:drop'),
    }),
    dropTargetForElements({ element: A }),
  );

  // lifting in [A]
  userEvent.lift(A);
  expect(ordered).toEqual(['a:preview', 'a:start']);
  ordered.length = 0;

  // now adding monitor
  const cleanupMonitor = monitorForElements({
    canMonitor: canMonitor,
    onGenerateDragPreview: () => ordered.push('monitor:preview'),
    onDragStart: () => ordered.push('monitor:start'),
    onDrag: () => ordered.push('monitor:drag'),
    onDropTargetChange: () => ordered.push('monitor:change'),
    onDrop: () => ordered.push('monitor:drop'),
  });

  // [A] -> []
  fireEvent.dragEnter(document.body);
  // checking if monitor can be used (but it will say false)
  expect(canMonitor).toHaveBeenCalledTimes(1);
  canMonitor.mockClear();
  expect(ordered).toEqual(['a:change']);
  ordered.length = 0;

  // dragging over []
  fireEvent.dragOver(document.body);
  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual(['a:drag']);
  ordered.length = 0;

  // cancel
  fireEvent.dragEnd(document.body);
  expect(ordered).toEqual(['a:drop']);
  ordered.length = 0;
  expect(canMonitor).toHaveBeenCalledTimes(0);

  cleanupA();
  cleanupMonitor();
});
