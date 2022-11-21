import {
  getExampleUrl,
  pageSelector,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

export function getURL(testName: string): string {
  const exampleUrl = getExampleUrl(
    'media',
    'media-ui',
    testName,
    global.__BASEURL__,
  );
  return exampleUrl;
}

export async function setup(url: string) {
  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);
  return page;
}

export async function takeSnapshot(
  page: PuppeteerPage,
  height: number,
  y = 120,
) {
  const image = await page.screenshot({
    clip: { x: 0, y, width: 800, height },
  });
  return image;
}
