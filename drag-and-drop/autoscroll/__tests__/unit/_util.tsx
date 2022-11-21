import type { CleanupFn, Input } from '@atlaskit/drag-and-drop/types';

export function getDefaultInput(overrides: Partial<Input> = {}): Input {
  const defaults: Input = {
    // user input
    altKey: false,
    button: 0,
    buttons: 0,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,

    // coordinates
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
  };

  return {
    ...defaults,
    ...overrides,
  };
}

export function getRect(box: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}): DOMRect {
  return {
    top: box.top,
    right: box.right,
    bottom: box.bottom,
    left: box.left,
    // calculated
    height: box.bottom - box.top,
    width: box.right - box.left,
    x: box.left,
    y: box.top,
    toJSON: function () {
      return JSON.stringify(this);
    },
  };
}

// usage: const [A, B, C, D, F] = getElements();
export function getElements(
  tagName: keyof HTMLElementTagNameMap = 'div',
): Iterable<Element> {
  const iterator = {
    next() {
      return {
        done: false,
        value: document.createElement(tagName),
      };
    },
    [Symbol.iterator]() {
      return iterator;
    },
  };
  return iterator;
}

export function setElementFromPoint(result: Element | null): CleanupFn {
  const original = document.elementFromPoint;

  document.elementFromPoint = () => result;

  return () => {
    document.elementFromPoint = original;
  };
}

export function combine(...fns: CleanupFn[]): CleanupFn {
  return function cleanup() {
    fns.forEach(fn => fn());
  };
}
