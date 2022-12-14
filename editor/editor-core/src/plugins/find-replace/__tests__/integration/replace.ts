import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import replaceAdf from './__fixtures__/replace-adf.json';
import { findReplaceSelectors } from '@atlaskit/editor-test-helpers/page-objects/find-replace';

BrowserTestCase(
  'replace.ts: modifying find text before replace should not restore stale pluginState replace text',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: replaceAdf,
      allowFindReplace: true,
    });

    await page.click(findReplaceSelectors.toolbarButton);

    await page.emptyTextFieldByBackspacing(findReplaceSelectors.findInput);
    await page.type(findReplaceSelectors.findInput, 'one');
    await page.keys('Enter');

    await page.type(findReplaceSelectors.replaceInput, 'HI');
    await page.click(findReplaceSelectors.replaceButton);

    await page.emptyTextFieldByBackspacing(findReplaceSelectors.replaceInput);
    await page.type(findReplaceSelectors.replaceInput, 'HO');

    await page.emptyTextFieldByBackspacing(findReplaceSelectors.findInput);
    await page.type(findReplaceSelectors.findInput, 'two');
    await page.click(findReplaceSelectors.replaceButton);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
