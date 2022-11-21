import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import { snapshot, initRendererWithADF } from './_utils';
import * as adf from '../__fixtures__/code-block.adf.json';
import * as adfCodeBlockOutsideViewport from '../__fixtures__/code-block-outside-viewport.adf.json';
import * as adfTrailingNewline from '../__fixtures__/code-block-trailing-newline.adf.json';
import { selectors } from '../__helpers/page-objects/_codeblock';

const scrollToBottom = (page: PuppeteerPage) =>
  page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

describe('Snapshot Test: CodeBlock', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  describe('codeblock', () => {
    afterEach(async () => {
      await snapshot(page, undefined, selectors.codeBlock);
    });

    test('should render copy-to-clipboard button correctly on hover', async () => {
      await initRendererWithADF(page, {
        appearance: 'full-page',
        rendererProps: { allowCopyToClipboard: true },
        adf,
      });
      await page.waitForSelector(selectors.codeBlock);
      await page.hover(selectors.codeBlock);
      await page.waitForSelector(
        `${selectors.codeBlock} ${selectors.copyToClipboardButton}`,
      );
      await page.hover(
        `${selectors.codeBlock} ${selectors.copyToClipboardButton}`,
      );
    });

    test('should render trailing newline', async () => {
      await initRendererWithADF(page, {
        appearance: 'full-page',
        adf: adfTrailingNewline,
      });
      await page.waitForSelector(selectors.codeBlock);
    });
  });

  describe('windowed codeblock (allowWindowedCodeBlock is enabled)', () => {
    describe('when not scrolled into viewport yet', () => {
      it('should initially render only a LightWeightCodeBlock offscreen', async () => {
        await initRendererWithADF(page, {
          appearance: 'full-page',
          rendererProps: {
            allowCopyToClipboard: true,
            featureFlags: { 'allow-windowed-code-block': true },
          },
          adf: adfCodeBlockOutsideViewport,
        });
        await page.waitForSelector(selectors.lightWeightCodeBlock);
        const akCodeBlockExists = await page.evaluate(
          (selector) => Boolean(document.querySelector(selector)),
          selectors.designSystemCodeBlock,
        );
        expect(akCodeBlockExists).toEqual(false);
      });
    });

    describe('when scrolled into viewport', () => {
      afterEach(async () => {
        await snapshot(page, undefined);
      });
      it('should eventually render a normal AkCodeBlock (with syntax highlighting)', async () => {
        await initRendererWithADF(page, {
          appearance: 'full-page',
          rendererProps: {
            allowCopyToClipboard: true,
            featureFlags: { 'allow-windowed-code-block': true },
          },
          adf: adfCodeBlockOutsideViewport,
        });
        await page.waitForSelector(selectors.lightWeightCodeBlock);
        await scrollToBottom(page);
        await page.waitForSelector(selectors.designSystemCodeBlock);
      });
    });
  });
});
