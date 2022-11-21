import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  fullpage,
  expectToMatchSelection,
  getDocFromElement,
  editable,
  setProseMirrorTextSelection,
  sendKeyNumTimes,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/expand';
import { selectionSelectors } from '@atlaskit/editor-test-helpers/page-objects/selection';

import expandAdf from './__fixtures__/empty-expand.json';
import expandWithNestedCodeBlockTallAdf from './__fixtures__/expand-with-nested-code-block-tall.json';
import collapsedExpandAdf from './__fixtures__/closed-expand.json';
import multiLineExpandAdf from './__fixtures__/two-line-expand.json';

describe('expand: arrow key navigation', () => {
  const startEditor = async (
    client: any,
    adf = expandAdf,
  ): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
      defaultValue: adf,
    });

    return page;
  };

  const sendArrowRightKey = async (
    page: WebDriverPage,
    opts: { numTimes?: number } = {},
  ) => {
    await sendKeyNumTimes(page, 'ArrowRight', opts);
  };

  const sendArrowLeftKey = async (
    page: WebDriverPage,
    opts: { numTimes?: number } = {},
  ) => {
    await sendKeyNumTimes(page, 'ArrowLeft', opts);
  };

  describe('given the gap cursor is on the left of the expand', () => {
    const startEditorWithLeftGapCursor = async (
      client: any,
      adf?: any,
    ): Promise<WebDriverPage> => {
      const page = await startEditor(client, adf);
      await sendArrowLeftKey(page, { numTimes: 2 });
      return page;
    };

    BrowserTestCase(
      'sets node selection when user hits right arrow',
      {},
      async (client: any) => {
        const page = await startEditorWithLeftGapCursor(client);
        await sendArrowRightKey(page);

        await expectToMatchSelection(page, { type: 'node', from: 0 });
      },
    );

    BrowserTestCase(
      'sets selection inside expand title when user hits right arrow twice',
      {},
      async (client: any, testName: string) => {
        const page = await startEditorWithLeftGapCursor(client);
        await sendArrowRightKey(page, { numTimes: 2 });
        await page.keys(['h', 'i']);

        const doc = await page.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'sets node selection when user hits right arrow thrice',
      {},
      async (client: any) => {
        const page = await startEditorWithLeftGapCursor(client);
        await sendArrowRightKey(page, { numTimes: 3 });

        await expectToMatchSelection(page, { type: 'node', from: 0 });
      },
    );

    BrowserTestCase(
      'sets right side gap cursor selection when user hits right arrow four times',
      {},
      async (client: any) => {
        const page = await startEditorWithLeftGapCursor(client);
        await sendArrowRightKey(page, { numTimes: 4 });

        await page.waitFor(selectionSelectors.gapCursor);
        await expectToMatchSelection(page, {
          type: 'gapcursor',
          side: 'right',
          from: 4,
        });
      },
    );
  });

  describe('given the gap cursor is on the right of the expand', () => {
    const startEditorWithRightGapCursor = async (
      client: any,
    ): Promise<WebDriverPage> => {
      const page = await startEditor(client);
      await sendArrowRightKey(page, { numTimes: 2 });
      return page;
    };

    BrowserTestCase(
      'sets node selection when user hits left arrow',
      {},
      async (client: any) => {
        const page = await startEditorWithRightGapCursor(client);
        await sendArrowLeftKey(page);

        await expectToMatchSelection(page, { type: 'node', from: 0 });
      },
    );

    BrowserTestCase(
      'sets selection inside expand title when user hits left arrow twice',
      {},
      async (client: any, testName: string) => {
        const page = await startEditorWithRightGapCursor(client);
        await sendArrowLeftKey(page, { numTimes: 2 });
        await page.keys(['h', 'i']);

        const doc = await page.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'sets node selection when user hits right arrow thrice',
      {},
      async (client: any) => {
        const page = await startEditorWithRightGapCursor(client);
        await sendArrowLeftKey(page, { numTimes: 3 });

        await expectToMatchSelection(page, { type: 'node', from: 0 });
      },
    );

    BrowserTestCase(
      'sets left side gap cursor selection when user hits left arrow four times',
      {},
      async (client: any) => {
        const page = await startEditorWithRightGapCursor(client);
        await sendArrowLeftKey(page, { numTimes: 4 });

        await page.waitFor(selectionSelectors.gapCursor);
        await expectToMatchSelection(page, {
          type: 'gapcursor',
          side: 'left',
          from: 0,
        });
      },
    );
  });

  describe('given the user clicks to select expand', () => {
    const startEditorWithNodeSelection = async (
      client: any,
    ): Promise<WebDriverPage> => {
      const page = await startEditor(client);
      await page.moveTo(selectors.expand, 5, 5);
      await page.click();
      await page.waitFor(
        `${selectors.expand}${selectionSelectors.selectedNode}`,
      );
      return page;
    };

    // The page.moveTo + page.click doesn't select the expand node in firefox or safari
    // Neither does calling element.click passing in x/y co-ordinates
    BrowserTestCase(
      'sets selection inside expand title when user hits left arrow',
      { skip: ['firefox', 'safari'] },
      async (client: any, testName: string) => {
        const page = await startEditorWithNodeSelection(client);
        await sendArrowLeftKey(page);
        await page.keys(['h', 'i']);

        const doc = await page.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'sets left side gap cursor selection when user hits left arrow twice',
      { skip: ['firefox', 'safari'] },
      async (client: any) => {
        const page = await startEditorWithNodeSelection(client);
        await sendArrowLeftKey(page, { numTimes: 2 });

        await page.waitFor(selectionSelectors.gapCursor);
        await expectToMatchSelection(page, {
          type: 'gapcursor',
          side: 'left',
          from: 0,
        });
      },
    );

    BrowserTestCase(
      'sets right side gap cursor selection when user hits right arrow',
      { skip: ['firefox', 'safari'] },
      async (client: any) => {
        const page = await startEditorWithNodeSelection(client);
        await sendArrowRightKey(page);

        await page.waitFor(selectionSelectors.gapCursor);
        await expectToMatchSelection(page, {
          type: 'gapcursor',
          side: 'right',
          from: 4,
        });
      },
    );

    describe('and then clicks inside expand title', () => {
      BrowserTestCase(
        'sets node selection when user hits left arrow',
        { skip: ['firefox', 'safari'] },
        async (client: any) => {
          const page = await startEditorWithNodeSelection(client);
          await page.click(selectors.expandTitleInput);
          await sendArrowLeftKey(page);

          await expectToMatchSelection(page, { type: 'node', from: 0 });
        },
      );

      BrowserTestCase(
        'sets left side gap cursor selection when user hits left arrow twice',
        { skip: ['firefox', 'safari'] },
        async (client: any) => {
          const page = await startEditorWithNodeSelection(client);
          await page.click(selectors.expandTitleInput);
          await sendArrowLeftKey(page, { numTimes: 2 });

          await page.waitFor(selectionSelectors.gapCursor);
          await expectToMatchSelection(page, {
            type: 'gapcursor',
            side: 'left',
            from: 0,
          });
        },
      );

      BrowserTestCase(
        'sets node selection when user hits right arrow',
        { skip: ['firefox', 'safari'] },
        async (client: any) => {
          const page = await startEditorWithNodeSelection(client);
          await page.click(selectors.expandTitleInput);
          await sendArrowRightKey(page);

          await expectToMatchSelection(page, { type: 'node', from: 0 });
        },
      );

      BrowserTestCase(
        'sets right side gap cursor selection when user hits right arrow twice',
        { skip: ['firefox', 'safari'] },
        async (client: any) => {
          const page = await startEditorWithNodeSelection(client);
          await page.click(selectors.expandTitleInput);
          await sendArrowRightKey(page, { numTimes: 2 });

          await page.waitFor(selectionSelectors.gapCursor);
          await expectToMatchSelection(page, {
            type: 'gapcursor',
            side: 'right',
            from: 4,
          });
        },
      );
    });
  });

  describe('given the focus is in expand title', () => {
    const startEditorWithTitleFocus = async (
      client: any,
      adf?: any,
    ): Promise<WebDriverPage> => {
      const page = await startEditor(client, adf);
      await page.click(selectors.expandTitleInput);
      return page;
    };

    BrowserTestCase(
      'sets selection inside expand body when user hits down arrow',
      {},
      async (client: any, testName: string) => {
        const page = await startEditorWithTitleFocus(client);
        await page.keys('ArrowDown');
        await page.keys(['h', 'i']);

        const doc = await page.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'sets selection below collapsed expand when user hits down arrow',
      {},
      async (client: any, testName: string) => {
        const page = await startEditorWithTitleFocus(
          client,
          collapsedExpandAdf,
        );
        await page.keys('ArrowDown');
        await page.keys(['h', 'i']);

        const doc = await page.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'sets left side gap cursor selection when user hits up arrow',
      {},
      async (client: any) => {
        const page = await startEditorWithTitleFocus(client);
        await page.keys('ArrowUp');

        await page.waitFor(selectionSelectors.gapCursor);
        await expectToMatchSelection(page, {
          type: 'gapcursor',
          side: 'left',
          from: 0,
        });
      },
    );
  });

  describe('given the focus is in expand body', () => {
    BrowserTestCase(
      'sets focus inside expand title when user hits up arrow',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client);
        await page.keys('ArrowUp');
        await page.keys(['h', 'i']);

        const doc = await page.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );

    describe('and in code block', () => {
      // FIXME: This test was automatically skipped due to failure on 31/10/2022: https://product-fabric.atlassian.net/browse/ED-15999
      BrowserTestCase(
        'dont jump to expand title when user hits up and down arrow in code block',
        // safari skipped until prosemirror-view upgraded with this fix
        // https://github.com/ProseMirror/prosemirror-view/pull/134
        {
          // skip: ['safari'],
          skip: ['*'],
        },
        async (client: any, testName: string) => {
          const page = await startEditor(
            client,
            expandWithNestedCodeBlockTallAdf,
          );

          const selector = '[data-testid="code-block--code"]';

          // get code block position
          let { left, top, bottom } = JSON.parse(
            await page.executeAsync((selector, done) => {
              const { left, top, bottom } = (document as any)
                .querySelector(selector)
                .getBoundingClientRect();

              done(
                JSON.stringify({
                  left: left + 2,
                  top: top + 2,
                  bottom: bottom - 2,
                }),
              );
            }, selector),
          );

          // simulate click at bottom left of code block
          // needs click twice
          await page.simulateUserDragAndDrop(left, bottom, left, bottom, 100);
          await new Promise((r) => setTimeout(r, 200));
          await page.simulateUserDragAndDrop(left, bottom, left, bottom, 100);

          for (let i = 0; i < 5; i += 1) {
            await page.keys('ArrowUp');
          }
          await page.keys(['h', 'i']);
          await page.keys(['ArrowUp', 'ArrowUp']);
          await page.keys(['h', 'i']);
          await page.keys('ArrowUp');
          await page.keys('ArrowUp');
          await page.keys(['h', 'i']);

          // get code block position again
          ({ left, top, bottom } = JSON.parse(
            await page.executeAsync((selector, done) => {
              const { left, top, bottom } = (document as any)
                .querySelector(selector)
                .getBoundingClientRect();
              done(
                JSON.stringify({
                  left: left + 2,
                  top: top + 2,
                  bottom: bottom - 2,
                }),
              );
            }, selector),
          ));

          // simulate click at top left of code block
          await page.simulateUserDragAndDrop(left, top, left, top, 100);

          for (let i = 0; i < 7; i += 1) {
            await page.keys('ArrowDown');
          }

          await page.keys(['h', 'i']);
          await page.keys('ArrowDown');
          await page.keys(['h', 'i']);

          const doc = await page.$eval(editable, getDocFromElement);
          expect(doc).toMatchCustomDocSnapshot(testName);
        },
      );
    });

    BrowserTestCase(
      "doesn't set focus inside expand title when user hits up arrow from second line of expand body",
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, multiLineExpandAdf);
        // set selection at end of second line (there was some flakiness when trying to get this selection by clicking)
        await setProseMirrorTextSelection(page, { anchor: 10 });
        await page.keys('ArrowUp');
        await page.keys(['h', 'i']);

        const doc = await page.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );
  });
});
