import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ActionGroup from '..';
import { ActionName } from '../../../../../../constants';
import { ActionItem } from '../../types';
import { messages } from '../../../../../../messages';

describe('ActionGroup', () => {
  const testId = 'smart-element-test';
  let containerOnClick = jest.fn();

  const setup = (itemsCount: number, visibleButtonsNum?: number) => {
    const makeActionItem: (_: any, i: number) => ActionItem = (_, i) => ({
      onClick: jest.fn(),
      name: ActionName.DeleteAction,
      testId: `${testId}-${i + 1}`,
      hideContent: false,
      hideIcon: false,
    });
    const items = Array(itemsCount).fill(null).map(makeActionItem);

    return render(
      <IntlProvider locale="en">
        <div onClick={containerOnClick}>
          <ActionGroup items={items} visibleButtonsNum={visibleButtonsNum} />
        </div>
      </IntlProvider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when there is just one action item', () => {
    it('renders action group', async () => {
      const { container } = setup(1);

      const actionGroup = await waitFor(() => container.firstChild);

      expect(actionGroup).toBeTruthy();
      expect(actionGroup?.textContent).toMatch('Delete');
    });

    it('should not render ellipse button', async () => {
      const { queryByTestId } = setup(1);
      expect(queryByTestId('action-group-more-button')).toBeNull();
    });

    it('does not propagate click event to parent container', async () => {
      const { findByTestId } = setup(1);

      const action = await findByTestId('smart-element-test-1');
      userEvent.click(action);

      expect(containerOnClick).not.toHaveBeenCalled();
    });
  });

  describe.each([3, 2, 1])(
    'with up to %d buttons visible',
    (visibleButtonsNum) => {
      describe(`when there is ${visibleButtonsNum} actions`, () => {
        it(`should render ${visibleButtonsNum} actions as a buttons`, async () => {
          const { getByTestId } = setup(visibleButtonsNum, visibleButtonsNum);
          for (let i = 0; i < visibleButtonsNum; i++) {
            const element = await waitFor(() =>
              getByTestId(`smart-element-test-${i + 1}`),
            );
            expect(element).toBeDefined();
          }
        });

        it('should not render ellipse button', async () => {
          const { queryByTestId } = setup(visibleButtonsNum, visibleButtonsNum);
          expect(queryByTestId('action-group-more-button')).toBeNull();
        });
      });

      describe(`when there is more then ${visibleButtonsNum} actions`, () => {
        it(`should render ${
          visibleButtonsNum - 1
        } first action item(s) as a button(s)`, async () => {
          const { getByTestId, queryByTestId } = setup(
            visibleButtonsNum + 1,
            visibleButtonsNum,
          );
          // First minus one buttons are stand alone buttons
          for (let i = 0; i < visibleButtonsNum - 1; i++) {
            const element = await waitFor(() =>
              getByTestId(`smart-element-test-${i + 1}`),
            );
            expect(element).toBeDefined();
          }
          // Rest are not stand alone buttons
          for (let i = visibleButtonsNum - 1; i < visibleButtonsNum + 1; i++) {
            expect(queryByTestId(`smart-element-test-${i + 1}`)).toBeNull();
          }
        });

        it(`should render ellipse button for all but ${
          visibleButtonsNum - 1
        } first actions`, async () => {
          const { getByTestId } = setup(
            visibleButtonsNum + 1,
            visibleButtonsNum,
          );
          const element = await waitFor(() =>
            getByTestId('action-group-more-button'),
          );
          expect(element).toBeDefined();
        });

        it('should render rest of the actions when "more actions" button is clicked', async () => {
          const { getByTestId } = setup(
            visibleButtonsNum + 1,
            visibleButtonsNum,
          );
          const moreButton = await waitFor(() =>
            getByTestId('action-group-more-button'),
          );
          userEvent.click(moreButton);

          /**
           * for visibleButtonsNum = 3 and total 4 buttons,
           * dropdown shows actions #3, #4 (indices 2, 3)
           *
           * for visibleButtonsNum = 2 and total 3 buttons,
           * dropdown shows actions #2, #3 (indices 1, 2)
           *
           * for visibleButtonsNum = 1 and total 2 buttons,
           * dropdown shows actions #1, #2 (indices 0, 1)
           */
          for (let i = 0; i < 2; i++) {
            const secondActionElement = await waitFor(() =>
              getByTestId(`smart-element-test-${i + visibleButtonsNum}`),
            );
            expect(secondActionElement).toBeDefined();
            expect(secondActionElement?.textContent).toMatch('Delete');
          }
        });

        /**
         * for visibleButtonsNum = 3 and total 4 buttons,
         * dropdown shows actions #3, #4 (indices 2, 3)
         *
         * for visibleButtonsNum = 2 and total 3 buttons,
         * dropdown shows actions #2, #3 (indices 1, 2)
         *
         * for visibleButtonsNum = 1 and total 2 buttons,
         * dropdown shows actions #1, #2 (indices 0, 1)
         */
        for (let i = 0; i < 2; i++) {
          it(`does not propagate click event to parent container when dropdown item ${
            i + visibleButtonsNum
          }  is clicked`, async () => {
            const itemCount = visibleButtonsNum + 1;
            const { findByTestId } = setup(itemCount, visibleButtonsNum);
            const moreButton = await findByTestId('action-group-more-button');
            userEvent.click(moreButton); // Open dropdown
            expect(containerOnClick).not.toHaveBeenCalled();

            const actionTestId = `smart-element-test-${i + visibleButtonsNum}`;
            const action = await findByTestId(actionTestId);
            userEvent.click(action);
            expect(containerOnClick).not.toHaveBeenCalled();
          });
        }

        it('renders tooltip when "more actions" button is hovered', async () => {
          const { findByTestId } = setup(
            visibleButtonsNum + 1,
            visibleButtonsNum,
          );
          const moreButton = await findByTestId('action-group-more-button');
          fireEvent.mouseOver(moreButton);
          const tooltip = await findByTestId(
            'action-group-more-button-tooltip',
          );

          expect(tooltip).toBeTruthy();
          expect(tooltip.textContent).toBe(
            messages.more_actions.defaultMessage,
          );
        });
      });
    },
  );
});
