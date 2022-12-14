import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForNumImages } from './_utils';
import adf from './_fixtures_/one-image.adf';

BrowserTestCase(
  'Copy paste a media single with alt text properly',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(adf),
      media: {
        allowMediaSingle: true,
        allowAltTextOnImages: true,
      },
    });
    const [image] = await waitForNumImages(page, 1);

    await image.click();
    await page.copy();
    await page.keys(['ArrowDown']);
    await page.paste();

    await waitForNumImages(page, 2);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
