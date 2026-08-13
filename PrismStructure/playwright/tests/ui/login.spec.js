// @ts-check
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const { registerAndLogin } = require('../../helpers/uiFlows');

/** Manual traceability: TC-LOG-001 | Smoke */
test.describe('Login @smoke', () => {
  test('TC-UI-LOG-001: Successful login with valid registered credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const user = await registerAndLogin(page);

    await expect(page).toHaveURL(/\/account/);
    await homePage.open();
    await expect(homePage.userMenu).toBeVisible();
    expect(user.email).toContain('@');
  });
});
