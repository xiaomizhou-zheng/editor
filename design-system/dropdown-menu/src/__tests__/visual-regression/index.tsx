import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const dropdownTrigger = '[data-testid="dropdown--trigger"]';
const dropdownContent = '[data-testid="dropdown--content"]';

describe('Snapshot Test', () => {
  it('it should match visual snapshot for dropdown', async () => {
    const url = getExampleUrl(
      'design-system',
      'dropdown-menu',
      'default-dropdown-menu',
      global.__BASEURL__,
    );

    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(dropdownContent);

    const dropdownImage = await page.screenshot();
    expect(dropdownImage).toMatchProdImageSnapshot();
  });

  it('it should set fallback placements correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'dropdown-menu',
      'testing-placements',
      global.__BASEURL__,
    );

    const { page } = global;

    await loadPage(page, url);

    const dropdownImage = await page.screenshot();
    expect(dropdownImage).toMatchProdImageSnapshot();
  });

  it('should accept custom zIndex', async () => {
    const url = getExampleUrl(
      'design-system',
      'dropdown-menu',
      'setting-z-index',
      global.__BASEURL__,
    );

    const { page } = global;
    const button = "[data-testid='popup--trigger']";

    await loadPage(page, url);
    await page.waitForSelector(button);
    await page.click(button);

    await page.waitForSelector(dropdownTrigger);
    await page.click(dropdownTrigger);
    await page.waitForSelector(dropdownContent);

    const popupImage = await page.screenshot();
    expect(popupImage).toMatchProdImageSnapshot();
  });

  it('it should re-position menu after change in loading state', async () => {
    const url = getExampleUrl(
      'design-system',
      'dropdown-menu',
      'testing-is-loading-reposition',
      global.__BASEURL__,
    );

    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(dropdownContent);

    const dropdownIsLoading = await page.screenshot();
    expect(dropdownIsLoading).toMatchProdImageSnapshot();

    const button = "[data-testid='toggle']";
    await page.click(button);

    const dropdownHasLoaded = await page.screenshot();
    expect(dropdownHasLoaded).toMatchProdImageSnapshot();
  });
});
