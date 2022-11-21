import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import { animationFrame, snapshot, initRendererWithADF } from './_utils';
import { selectors } from '../__helpers/page-objects/_expand';
import { expandADF } from '../__fixtures__/expand-adf';
import { ThemeModes } from '@atlaskit/theme/types';

const themes: ThemeModes[] = ['light', 'dark'];

const initRenderer = async (
  page: PuppeteerPage,
  adf: any,
  themeMode: ThemeModes = 'light',
) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    device: Device.LaptopMDPI,
    adf,
    themeMode,
  });
};

describe('Snapshot Test: Expand', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, selectors.expand);
    // Reset mouse position to avoid accidental hover effects for subsequent tests
    await page.mouse.move(0, 0);
  });

  /**
   * All tests in the `describe.each(themes)` block below are executed twice for both light and dark themes.
   */
  describe.each(themes)('Theme: %s', (theme) => {
    test(`should render a border on hover of a collapsed top level expand`, async () => {
      await initRenderer(page, expandADF(), theme);
      await page.waitForSelector(selectors.expand);
      await page.hover(selectors.expand);
    });

    test('should expand a collapsed top level expand on toggle', async () => {
      await initRenderer(page, expandADF(), theme);
      await page.waitForSelector(selectors.expand);
      await page.click(selectors.expandToggle);
    });

    test('should have a left aligned title when wrapped', async () => {
      await initRenderer(
        page,
        expandADF(
          undefined,
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem',
        ),
        theme,
      );
      await page.waitForSelector(selectors.expand);
    });
  });

  describe.each(['default', 'wide', 'full-width'])('Breakout: %s', (mode) => {
    test(`should render a ${mode} collapsed top level expand`, async () => {
      await initRenderer(page, expandADF(mode));
      await page.waitForSelector(selectors.expand);
    });

    test('should expand a collapsed nested expand on toggle', async () => {
      await initRenderer(page, expandADF(mode));
      await page.waitForSelector(selectors.expand);
      await page.click(selectors.expandToggle);

      await animationFrame(page);
      await page.waitForSelector(selectors.nestedExpandToggle);
      await page.click(selectors.nestedExpandToggle);
    });
  });
});
