import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Inline', () => {
  it.each(['spacing', 'alignment'])(
    `%s example should match snapshot`,
    async (selector) => {
      const url = getExampleUrl(
        'design-system',
        'ds-explorations',
        'inline',
        global.__BASEURL__,
      );
      const { page } = global;

      await loadPage(page, url);

      const image = await takeElementScreenShot(
        page,
        `[data-testid="inline-${selector}"]`,
      );
      expect(image).toMatchProdImageSnapshot();
    },
  );
});
