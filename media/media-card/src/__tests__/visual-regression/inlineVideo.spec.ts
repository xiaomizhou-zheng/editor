import { getExampleUrl } from '@atlaskit/visual-regression/helper';

function getURL(): string {
  return getExampleUrl(
    'media',
    'media-card',
    'vr-inline-video-card',
    global.__BASEURL__,
  );
}

async function setup(url: string) {
  const { page } = global;
  await page.goto(url);

  await page.waitForSelector('[data-testid="media-image"]');

  const image = await page.screenshot({
    clip: { x: 0, y: 72, width: 800, height: 354 },
  });

  // TODO: https://product-fabric.atlassian.net/browse/MEX-1140
  // Puppeteer has a limitation to support media files(from https://pptr.dev/), so we cannot currently display the preview for videos as a snapshot
  return { image };
}

describe('Inline Video Card', () => {
  // FIXME: This test was automatically skipped due to failure on 30/09/2022: https://product-fabric.atlassian.net/browse/MEX-2005
  it.skip('Inline Video Card tests', async () => {
    const url = getURL();
    const { image } = await setup(url);
    expect(image).toMatchProdImageSnapshot();
  });
});
