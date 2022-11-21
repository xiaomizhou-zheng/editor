import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  getDocFromElement,
  editable,
  gotoEditor,
  linkUrlSelector,
  insertLongText,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

// FIXME: This test was automatically skipped due to failure on 31/10/2022: https://product-fabric.atlassian.net/browse/ED-16002
BrowserTestCase(
  `card: selecting a link from CMD + K menu should create an inline card using keyboard`,
  {
    skip: ['*'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    await gotoEditor(page);

    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);

    await page.type(linkUrlSelector, 'home opt-in');
    await page.keys(['ArrowDown', 'Return']);
    await page.waitForSelector('.inlineCardView-content-wrap');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  // FIXME: This test was automatically skipped due to failure on 31/10/2022: https://product-fabric.atlassian.net/browse/ED-16002
  BrowserTestCase(
    `card: selecting a link from CMD + K menu should create an inline card using keyboard`,
    {
      skip: ['*'],
    },
    async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          smartLinks: {
            allowEmbeds: true,
          },
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          providers: {
            cards: true,
          },
          withLinkPickerOptions: true,
        },
      );
      await insertLongText(page);
      await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await page.waitForSelector(linkPickerSelectors.linkInput);

      await page.type(linkPickerSelectors.linkInput, 'home opt-in');
      await page.keys(['ArrowDown', 'Return']);
      await page.waitForSelector('.inlineCardView-content-wrap');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
