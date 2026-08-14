/**
 * Short pause so key UI steps are visible when running with --headed.
 * Skipped in normal headless CI/terminal runs.
 */

function isHeadedRun() {
  return process.argv.includes('--headed') || process.env.PW_HEADED === '1';
}

async function demoPause(page, ms = 1000) {
  if (isHeadedRun()) {
    await page.waitForTimeout(ms);
  }
}

module.exports = { demoPause, isHeadedRun };
