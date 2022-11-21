import React, { useState } from 'react';

import { act, cleanup, fireEvent, render } from '@testing-library/react';

import Button from '@atlaskit/button';

import InlineDialogWithAnalytics from '../../../index';
import { InlineDialogWithoutAnalytics as InlineDialog } from '../../index';

declare var global: any;

interface InlineDialogWrapperProps {
  inlineDialogTestId: string;
  buttonTestId: string;
}

jest.mock('popper.js', () => {
  // @ts-ignore requireActual property is missing from jest
  const PopperJS = jest.requireActual('popper.js');

  return class Popper {
    static placements = PopperJS.placements;

    constructor() {
      return {
        // eslint-disable-next-line
        destroy: () => {},
        // eslint-disable-next-line
        update: () => {},
      };
    }
  };
});

describe('inline-dialog', () => {
  afterEach(cleanup);

  it('should render the children of an inline dialog as the target', () => {
    const { queryByTestId } = render(
      <InlineDialog content={() => null}>
        <div data-testid="child-content">Click me!</div>
      </InlineDialog>,
    );

    expect(queryByTestId('child-content')).not.toBeNull();
  });

  describe('isOpen', () => {
    const content = (
      <div data-testid="inline-dialog-content">
        <p>Hello!</p>
      </div>
    );

    it('should render the content when is open', () => {
      const { queryByTestId } = render(
        <InlineDialog content={content} isOpen={true}>
          <div id="children" />
        </InlineDialog>,
      );

      expect(queryByTestId('inline-dialog-content')).not.toBeNull();
    });

    it('should not render the content when is not open', () => {
      const { queryByTestId } = render(
        <InlineDialog content={content} isOpen={false}>
          <div id="children" />
        </InlineDialog>,
      );

      expect(queryByTestId('inline-dialog-content')).toBeNull();
    });
  });

  describe('onContentClick', () => {
    it('should be triggered when the content is clicked', () => {
      const spy = jest.fn();
      const dummyContent = (
        <div data-testid="dummy-content">This is some content</div>
      );
      const { getByTestId } = render(
        <InlineDialog onContentClick={spy} content={dummyContent} isOpen>
          <div>trigger</div>
        </InlineDialog>,
      );

      fireEvent.click(getByTestId('dummy-content'));

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContentFocus', () => {
    it('should be triggered when an element in the content is focused', () => {
      const spy = jest.fn();
      const dummyLink = (
        <a data-testid="dummy-link" href="/test">
          This is a dummy link
        </a>
      );

      const { getByTestId } = render(
        <InlineDialog onContentFocus={spy} content={dummyLink} isOpen>
          <div id="children" />
        </InlineDialog>,
      );

      getByTestId('dummy-link').focus();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContentBlur', () => {
    it('should be triggered when an element in the content is blurred', () => {
      const spy = jest.fn();
      const dummyLink = (
        <a data-testid="dummy-link" href="/test">
          This is a dummy link
        </a>
      );
      const { getByTestId } = render(
        <InlineDialog onContentBlur={spy} content={dummyLink} isOpen>
          <div id="children" />
        </InlineDialog>,
      );

      fireEvent.blur(getByTestId('dummy-link'));

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleClickOutside', () => {
    describe('EventListeners', () => {
      let addSpy: jest.SpyInstance;
      let removeSpy: jest.SpyInstance;
      beforeEach(() => {
        addSpy = jest.spyOn(window, 'addEventListener');
        removeSpy = jest.spyOn(window, 'removeEventListener');
      });

      afterEach(jest.restoreAllMocks);

      it('should add event listener onOpen', () => {
        jest.useFakeTimers(); // mock timers

        const { getByTestId } = render(
          <InlineDialog content={() => null} isOpen testId="inline-dialog">
            <div id="children" />
          </InlineDialog>,
        );

        act(() => {
          jest.runAllTimers(); // trigger setTimeout
        });

        expect(getByTestId('inline-dialog')).toBeInTheDocument();
        expect(
          addSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(1);
        expect(
          removeSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(0);
      });

      it('should remove event listener onOpen => remove onClose', () => {
        jest.useFakeTimers(); // mock timers

        const { getByTestId, rerender } = render(
          <InlineDialog content={() => null} isOpen testId="inline-dialog">
            <div id="children" />
          </InlineDialog>,
        );

        act(() => {
          jest.runAllTimers(); // trigger setTimeout
        });

        expect(getByTestId('inline-dialog')).toBeInTheDocument();
        expect(
          addSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(1);

        rerender(
          <InlineDialog content={() => null} testId="inline-dialog">
            <div id="children" />
          </InlineDialog>,
        );

        // no new event listeners added
        expect(
          addSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(1);
        expect(
          removeSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(1);
      });
    });

    it('should invoke onClose callback on page click by default', () => {
      const callback = jest.fn();
      jest.useFakeTimers(); // mock timers

      render(
        <InlineDialog content={() => null} onClose={callback} isOpen>
          <div id="children" />
        </InlineDialog>,
      );

      act(() => {
        jest.runAllTimers(); // trigger setTimeout
      });

      // click anywhere outside of inline dialog
      fireEvent.click(document.body);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should NOT invoke onClose callback when isOpen is false', () => {
      const callback = jest.fn();
      render(
        <InlineDialog content={() => null} onClose={callback}>
          <div id="children" />
        </InlineDialog>,
      );

      // click anywhere outside of inline dialog
      fireEvent.click(document);
      expect(callback).not.toHaveBeenCalledTimes(1);
    });

    it('should open and close correctly when one dialog is opened after the other', () => {
      const content = <div>Hello!</div>;

      const InlineDialogWrapper = (props: InlineDialogWrapperProps) => {
        const { inlineDialogTestId, buttonTestId } = props;
        const [dialogOpen, setDialogOpen] = useState<boolean>(false);

        const toggleInlineDialog = () => {
          setDialogOpen(true);
        };

        return (
          <InlineDialog
            content={content}
            isOpen={dialogOpen}
            onClose={() => {
              setDialogOpen(false);
            }}
            testId={inlineDialogTestId}
          >
            <Button onClick={() => toggleInlineDialog()} testId={buttonTestId}>
              Click me!
            </Button>
          </InlineDialog>
        );
      };

      const { getByTestId, queryByTestId } = render(
        <div>
          <InlineDialogWrapper
            inlineDialogTestId="inline-dialog-0"
            buttonTestId="open-inline-dialog-0"
          />
          <InlineDialogWrapper
            inlineDialogTestId="inline-dialog-1"
            buttonTestId="open-inline-dialog-1"
          />
        </div>,
      );

      // Open first dialog, second dialog should not exist yet.
      fireEvent.click(getByTestId('open-inline-dialog-0'));
      expect(getByTestId('inline-dialog-0')).toBeInTheDocument();
      expect(queryByTestId('inline-dialog-1')).toBeNull();

      // Open second dialog, first dialog should close.
      fireEvent.click(getByTestId('open-inline-dialog-1'));
      expect(queryByTestId('inline-dialog-1')).toBeInTheDocument();
      expect(queryByTestId('inline-dialog-0')).toBeNull();
    });
  });
});

describe('InlineDialogWithAnalytics', () => {
  let consoleWarn: jest.SpyInstance;
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleWarn = jest.spyOn(global.console, 'warn');
    consoleError = jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    consoleWarn.mockRestore();
    consoleError.mockRestore();
  });

  it('should mount without errors', () => {
    render(<InlineDialogWithAnalytics children={''} content={''} />);

    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
