import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlFlag = getExampleUrl('design-system', 'flag', 'testing');

/* Css selectors used for the test */
const addFlagBtn = "[data-testid='AddFlag']";
const flagTestId1 = "[data-testid='MyFlagTestId--1']";
const flagTestId2 = "[data-testid='MyFlagTestId--2']";
const flagActionTestId1 =
  "[data-testid='MyFlagTestId--1'] [data-testid='MyFlagAction']";
const flagActionTestId2 =
  "[data-testid='MyFlagTestId--2'] [data-testid='MyFlagAction']";
const dismisFlag = "[aria-label='Dismiss']";

// This test was originally marked as flakey. It could not be reproduced so it
// has been restored. See https://product-fabric.atlassian.net/browse/DSP-3270
// and https://product-fabric.atlassian.net/browse/SKIP-282.
BrowserTestCase(
  'Flag and Flag actions should be able to be identified and clicked by data-testid',
  {},
  async (client: any) => {
    const flagTest = new Page(client);
    await flagTest.goto(urlFlag);
    await flagTest.waitFor(addFlagBtn, 5000);
    await flagTest.click(addFlagBtn);
    expect(await flagTest.isVisible(flagTestId1)).toBe(true);
    expect(await flagTest.isVisible(flagActionTestId1)).toBe(true);
    await flagTest.click(flagActionTestId1);
    const textAlert = await flagTest.getAlertText();
    expect(textAlert).toBe('Flag has been clicked!');
    await flagTest.acceptAlert();
    await flagTest.click(addFlagBtn);
    expect(await flagTest.isVisible(flagTestId1)).toBe(true);
    expect(await flagTest.isVisible(flagActionTestId1)).toBe(true);
    expect(await flagTest.isVisible(flagTestId2)).toBe(true);
    expect(await flagTest.isVisible(flagActionTestId2)).toBe(true);
    await flagTest.click(dismisFlag);
    expect(await flagTest.isVisible(flagTestId1)).toBe(true);
    expect(await flagTest.isVisible(flagActionTestId1)).toBe(true);
  },
);
