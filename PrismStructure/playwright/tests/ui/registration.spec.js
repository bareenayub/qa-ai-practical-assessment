// @ts-check
const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { buildUiRegistrationUser } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-REG-001
 * Module: User Registration | Type: Smoke
 */
test.describe('User Registration @smoke', () => {
  test('TC-UI-REG-001: Successful new user registration with valid data', async ({ page }) => {
    const user = buildUiRegistrationUser();
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    await registerPage.open();
    await registerPage.register(user);

    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 });
    await loginPage.login(user.email, user.password);
    await expect(page).toHaveURL(/\/account/);
  });
});
