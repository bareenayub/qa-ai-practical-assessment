// @ts-check
// Demo order: 04 — login (uses user from 03-registration)
const { test, expect } = require('../../fixtures/demoTest');
const { HomePage } = require('../../pages/HomePage');
const { registerUser, loginWithCredentials } = require('../../helpers/uiFlows');
const { getSuiteUser, rememberSuiteUser } = require('../../helpers/sharedSession');

/** Manual traceability: TC-LOG-001 | Smoke */
test.describe('Login @smoke', () => {
  test('TC-UI-LOG-001: Successful login with valid registered credentials', async ({ page }) => {
    const homePage = new HomePage(page);

    let user = getSuiteUser();
    if (!user) {
      user = rememberSuiteUser(await registerUser(page));
    }

    await loginWithCredentials(page, user);

    await expect(page).toHaveURL(/\/account/);
    await homePage.open();
    await expect(homePage.userMenu).toBeVisible();
    expect(user.email).toContain('@');
  });
});
