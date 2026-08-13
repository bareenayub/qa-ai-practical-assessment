// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { DEFAULT_CUSTOMER } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-LOG-001
 * Module: Login | Type: Smoke
 */
test.describe('Login @smoke', () => {
  test('TC-UI-LOG-001: Successful login with valid registered credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.open();
    await loginPage.login(DEFAULT_CUSTOMER.email, DEFAULT_CUSTOMER.password);

    await expect(page).toHaveURL(/\/account/);
    await homePage.open();
    await expect(homePage.userMenu).toBeVisible();
  });
});
