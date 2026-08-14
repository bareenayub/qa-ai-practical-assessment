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

async function highlightFill(page, locator, value, label) {
  if (isHeadedRun()) {
    await showStepBanner(page, label);
    await locator.scrollIntoViewIfNeeded();
    await demoPause(page, 500);
  }

  await locator.fill(value);
}

module.exports = {
  demoPause,
  isHeadedRun,
  showStepBanner,
  clearHighlights,
  highlightLocator,
  highlightClick,
  highlightFill,
};
