import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  clickOnStatus,
  waitForStatusToolbar,
  insertStatusFromMenu,
  STATUS_SELECTORS,
} from '@atlaskit/editor-test-helpers/page-objects/status';
import {
  animationFrame,
  waitForElementOffset,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
import adf from './__fixtures__/status-adf.json';
import overflownStatusInsideTableAdf from './__fixtures__/overflow-status-inside-table.adf.json';

import blank_adf from './__fixtures__/blank-adf.json';
import {
  insertTaskFromMenu,
  ITEM_SELECTOR,
} from '@atlaskit/editor-test-helpers/page-objects/task';

describe('Status:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  async function clickStatusAndWait() {
    await animationFrame(page);
    await clickOnStatus(page);
    await animationFrame(page);
    await waitForStatusToolbar(page);
    await animationFrame(page);
  }

  it('should display as selected', async () => {
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 300 },
    });
    await clickStatusAndWait();
    await snapshot(page);
  });

  // FIXME: This test was automatically skipped due to failure on 05/11/2022: https://product-fabric.atlassian.net/browse/ED-16066
  it.skip('should insert status inside action item and keep focus on it', async () => {
    await initEditorWithAdf(page, {
      adf: blank_adf,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 400 },
    });
    await insertTaskFromMenu(page);
    await page.waitForSelector(ITEM_SELECTOR);
    await insertStatusFromMenu(page);
    await page.waitForSelector(STATUS_SELECTORS.STATUS_NODE);
    await animationFrame(page);
    await animationFrame(page);
    await snapshot(page);
  });

  it('when overflown inside a table and selected', async () => {
    await initEditorWithAdf(page, {
      adf: overflownStatusInsideTableAdf,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 400 },
    });
    await clickStatusAndWait();
    await page.click(STATUS_SELECTORS.STATUS_POPUP_INPUT);
    await waitForElementOffset(page, STATUS_SELECTORS.STATUS_POPUP_INPUT, {
      top: { min: 100, max: 300 },
      left: { min: 20, max: 150 },
    });
    await snapshot(page, undefined, undefined, {
      captureBeyondViewport: false,
    });
  });
});
