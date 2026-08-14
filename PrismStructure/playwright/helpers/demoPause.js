/**
 * Headed-run helpers: pauses, step banners, and CTA highlights for demo visibility.
 * No-op in headless CI runs (fast path unchanged).
 */

function isHeadedRun() {
  return process.argv.includes('--headed') || process.env.PW_HEADED === '1';
}

async function demoPause(page, ms = 1000) {
  if (isHeadedRun()) {
    await page.waitForTimeout(ms);
  }
}

async function showStepBanner(page, message) {
  if (!isHeadedRun()) {
    return;
  }

  await page.evaluate((text) => {
    document.querySelectorAll('[data-qa-demo-banner]').forEach((node) => node.remove());
    const banner = document.createElement('div');
    banner.setAttribute('data-qa-demo-banner', '1');
    banner.textContent = text;
    Object.assign(banner.style, {
      position: 'fixed',
      top: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '2147483647',
      background: '#1d4ed8',
      color: '#fff',
      padding: '10px 18px',
      borderRadius: '8px',
      font: '600 14px system-ui, sans-serif',
      boxShadow: '0 4px 14px rgba(0,0,0,.3)',
      pointerEvents: 'none',
    });
    document.body.appendChild(banner);
  }, message);
}

async function clearHighlights(page) {
  if (!isHeadedRun()) {
    return;
  }

  await page
    .evaluate(() => {
      document.querySelectorAll('[data-qa-demo-outline]').forEach((el) => {
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.style.boxShadow = '';
        el.removeAttribute('data-qa-demo-outline');
      });
    })
    .catch(() => {});
}

async function highlightLocator(page, locator, label) {
  if (!isHeadedRun()) {
    return;
  }

  await showStepBanner(page, label);
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate((el) => {
    el.setAttribute('data-qa-demo-outline', '1');
    el.style.outline = '3px solid #f59e0b';
    el.style.outlineOffset = '3px';
    el.style.boxShadow = '0 0 0 6px rgba(245, 158, 11, 0.35)';
  });
  await demoPause(page, 900);
}

async function highlightClick(page, locator, label) {
  await highlightLocator(page, locator, label);
  await locator.click();
  await demoPause(page, 700);
  await clearHighlights(page);
}

/** Short headed pause so the user can review a filled form before Submit. */
async function pauseBeforeSubmit(page, label = 'Review form, then click Submit') {
  if (!isHeadedRun()) {
    return;
  }

  await showStepBanner(page, label);
  await demoPause(page, 2_000);
}

async function highlightFill(page, locator, value, label) {
  if (isHeadedRun()) {
    await showStepBanner(page, label);
    await locator.scrollIntoViewIfNeeded();
    await demoPause(page, 500);
  }

  await locator.fill(value);
}

/** Type into a field character-by-character in headed mode (e.g. search bar). */
async function highlightType(page, locator, value, label) {
  if (isHeadedRun()) {
    await showStepBanner(page, label);
    await locator.scrollIntoViewIfNeeded();
    await locator.clear();
    await locator.pressSequentially(value, { delay: 120 });
    await demoPause(page, 800);
    return;
  }

  await locator.fill(value);
}

/** Pause on invoice list/detail so headed demos can read the page. */
async function pauseForInvoiceView(page, message = 'Review invoice details') {
  if (!isHeadedRun()) {
    return;
  }

  await showStepBanner(page, message);
  await demoPause(page, 2_500);
}

/** Pause between UI demo tests so the headed flow is easier to follow. */
async function pauseBetweenTests(page, ms = 2_000) {
  await demoPause(page, ms);
}

module.exports = {
  demoPause,
  isHeadedRun,
  showStepBanner,
  clearHighlights,
  highlightLocator,
  highlightClick,
  highlightFill,
  highlightType,
  pauseBeforeSubmit,
  pauseForInvoiceView,
  pauseBetweenTests,
};
