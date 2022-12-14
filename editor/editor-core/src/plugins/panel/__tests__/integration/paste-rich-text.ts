import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
  clipboardInput,
  copyAsHTMLButton,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { selectors } from './_utils';

BrowserTestCase(
  'paste-rich-text.ts: Paste rich text into panel',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await page.isVisible(clipboardInput);
    await page.type(
      clipboardInput,
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
    );
    await page.click(copyAsHTMLButton);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
    });

    await page.click(editable);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
