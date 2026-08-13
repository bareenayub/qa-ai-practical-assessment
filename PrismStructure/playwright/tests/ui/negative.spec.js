// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { DEFAULT_CUSTOMER } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-NEG-001
 * Module: Invalid Login / Cart Update | Type: Regression
 */
test.describe('Negative Scenarios @regression', () => {
  test('TC-UI-NEG-001: Reject invalid login and prevent invalid cart quantity update', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login(DEFAULT_CUSTOMER.email, 'wrong-password-123');
    await expect(loginPage.loginError).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.login(DEFAULT_CUSTOMER.email, DEFAULT_CUSTOMER.password);
    await homePage.open();
    await homePage.search('Hammer');
    await homePage.openFirstProduct();
    await productPage.addToCart.click();

    await homePage.navCart.click();
    await checkoutPage.waitForCartStep();
    await checkoutPage.productQuantity.fill('0');
    await checkoutPage.productQuantity.blur();
    await expect(checkoutPage.productQuantity).toHaveValue('1');
  });
});
