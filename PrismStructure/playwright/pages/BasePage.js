const {
  demoPause,
  showStepBanner,
  highlightClick,
  highlightFill,
} = require('../helpers/demoPause');

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(path) {
    await this.page.goto(path);
  }

  /** Show a headed-run step banner (e.g. manual test step label). */
  async step(message) {
    await showStepBanner(this.page, message);
    await demoPause(this.page, 600);
  }

  /** Highlight a CTA, click it, then clear the highlight. */
  async highlightClick(locator, label) {
    await highlightClick(this.page, locator, label);
  }

  /** Highlight a field, fill it, for headed demo runs. */
  async highlightFill(locator, value, label) {
    await highlightFill(this.page, locator, value, label);
  }
}

module.exports = { BasePage };
