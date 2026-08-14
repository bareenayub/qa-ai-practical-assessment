// @ts-check
const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { buildUiRegistrationUser } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-REG-001 | Smoke
 * Scope: registration form only — ends on login redirect (login is TC-LOG-001).
 */
test.describe('User Registration @smoke', () => {
  test('TC-UI-REG-001: Successful new user registration with valid data', async ({ page }) => {
    const user = buildUiRegistrationUser();
    const registerPage = new RegisterPage(page);

    await registerPage.step('TC-REG-001: Register a new user');
    await registerPage.open();
    await registerPage.register(user);

    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 });
  });
});
