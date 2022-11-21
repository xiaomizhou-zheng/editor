import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openButtonSelector = '[data-testid="open-spotlight"]';
const spotlightTargetSelector = '[data-testid="spotlight--target"]';
const spotlightDialogSelector = '[data-testid="spotlight--dialog"]';
const focusLockSelector = 'div[data-focus-lock-disabled="false"]';
const spotlightContainer = '[data-testid="spotlight-examples"]';

// https://ecosystem.atlassian.net/browse/DS-7006
describe('onboarding spotlight visual regression', () => {
  it('should render a spotlight next to a target', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'spotlight-dialog-placement',
      __BASEURL__,
    );
    await loadPage(page, url);
    await page.waitForSelector(openButtonSelector);

    await page.click(openButtonSelector);
    await page.waitForSelector(spotlightTargetSelector);
    await page.waitForSelector(spotlightDialogSelector);
    // allow time for the focus lock to be enabled
    await page.waitForSelector(focusLockSelector);
    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('should move a spotlight after resizing the viewport', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'spotlight-dialog-placement',
      __BASEURL__,
    );
    await loadPage(page, url);
    await page.waitForSelector(openButtonSelector);

    await page.click(openButtonSelector);
    await page.waitForSelector(spotlightTargetSelector);
    await page.waitForSelector(spotlightDialogSelector);

    await page.setViewport({
      height: page.viewport()!.height,
      width: page.viewport()!.width * 0.8,
    });
    await page.waitForSelector(focusLockSelector);
    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('should render each button type correctly, with primary action in focus on the right hand side', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'spotlight-button-appearance',
      __BASEURL__,
    );
    await loadPage(page, url);
    await page.waitForSelector(openButtonSelector);

    await page.click(openButtonSelector);
    await page.waitForSelector(spotlightTargetSelector);
    await page.waitForSelector(spotlightDialogSelector);
    await page.waitForSelector(focusLockSelector);
    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('should inherit button theme from parent buttons', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'different-spotlights',
      __BASEURL__,
    );

    await loadPage(page, url);

    expect(
      await takeElementScreenShot(page, spotlightContainer),
    ).toMatchProdImageSnapshot();
  });

  // Skipped during daily merge due to flakiness blocking landkid pipelines
  // Please reduce flakiness and then reinstate
  it.skip('should not display pulse animation when pulse prop is false', async () => {
    const { __BASEURL__, page } = global;

    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'spotlight-without-pulse',
      __BASEURL__,
    );

    await loadPage(page, url, { disabledSideEffects: { animation: true } });
    await page.waitForSelector(openButtonSelector);
    await page.click(openButtonSelector);

    await page.waitForSelector(spotlightTargetSelector);
    await page.click(spotlightDialogSelector);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it(`should render the target with the correct height when the target element's height is determined by a parent element`, async () => {
    const { __BASEURL__, page } = global;

    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'spotlight-target-height',
      __BASEURL__,
    );

    await loadPage(page, url);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });
});
