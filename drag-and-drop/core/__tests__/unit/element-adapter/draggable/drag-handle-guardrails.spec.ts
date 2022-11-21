import { fireEvent } from '@testing-library/dom';

import { draggable } from '../../../../src/entry-point/adapter/element';
import { combine } from '../../../../src/entry-point/util/combine';
import { appendToBody, setElementFromPoint } from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

it('should warn if a drag handle is parent of the draggable', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const dragHandleThatIsTheParent = document.createElement('div');
  const draggableEl = document.createElement('div');
  dragHandleThatIsTheParent.appendChild(draggableEl);
  const onGenerateDragPreview = jest.fn();
  const cleanup = combine(
    appendToBody(dragHandleThatIsTheParent),
    setElementFromPoint(dragHandleThatIsTheParent),
    // ❌ this is bad, the drag handle cannot be a parent of the draggable
    draggable({
      element: draggableEl,
      dragHandle: dragHandleThatIsTheParent,
      onGenerateDragPreview,
    }),
    () => warn.mockReset(),
  );

  expect(warn).toHaveBeenCalled();

  cleanup();
});

it('should warn if a drag handle is disconnected from the draggable', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  // No parent/child relationship between dragHandle and element
  const dragHandle = document.createElement('div');
  const element = document.createElement('div');
  const onGenerateDragPreview = jest.fn();
  const cleanup = combine(
    appendToBody(dragHandle, element),
    setElementFromPoint(dragHandle),
    draggable({
      element: element,
      dragHandle: dragHandle,
      onGenerateDragPreview,
    }),
    () => warn.mockReset(),
  );

  expect(warn).toHaveBeenCalled();

  cleanup();
});
