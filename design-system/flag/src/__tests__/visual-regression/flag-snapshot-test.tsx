import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Flag-without-flagGroup should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-without-flag-group',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Success"]');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('shows up the focus ring on the button', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-without-flag-group',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Success"]');

    // navigate to button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('should match flags snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'bold-flag-component',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Error"] > svg');
    await page.waitForSelector('span[aria-label="Info"] > svg');
    await page.waitForSelector('span[aria-label="Success"] > svg');
    await page.waitForSelector('span[aria-label="Warning"] > svg');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('shows up the focus ring on the entire flag container', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-without-flag-group',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Success"]');

    // navigate to button
    await page.keyboard.press('Tab');

    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('Flag with long title should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-long-title',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Success"]');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('Flag with long content should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-long-content',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Success"]');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('Flag with description and link should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-with-a-description-containing-a-link',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Success"]');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
