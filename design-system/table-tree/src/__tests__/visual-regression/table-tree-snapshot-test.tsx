import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  (['none', 'light', 'dark'] as const).forEach((theme) => {
    it(`Controlled expanded state example should match prod (${theme})`, async () => {
      const url = getExampleUrl(
        'design-system',
        'table-tree',
        'controlled-expanded-state',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector('div[role="treegrid"]');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
