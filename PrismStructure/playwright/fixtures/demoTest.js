/**
 * Extends Playwright test with headed-only pauses between demo steps/tests.
 */
const { test: base, expect } = require('@playwright/test');
const { isHeadedRun, pauseBetweenTests, showStepBanner } = require('../helpers/demoPause');

const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    if (isHeadedRun()) {
      await showStepBanner(page, `Starting: ${testInfo.title}`);
      await pauseBetweenTests(page, 3_000);
    }

    await use(page);

    if (isHeadedRun()) {
      await pauseBetweenTests(page, 3_500);
    }
  },
});

module.exports = { test, expect };
