// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { DEFAULT_CUSTOMER } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-CRT-001
 * Module: Add to Cart | Type: Smoke
 */
test.describe('Add to Cart @smoke', () => {
  test('TC-UI-CRT-001: Add a single in-stock product to cart while logged in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login(DEFAULT_CUSTOMER.email, DEFAULT_CUSTOMER.password);

    await homePage.open();
    await homePage.search('Hammer');
    const productName = await homePage.productCards.first().getByTestId('product-name').textContent();
    await homePage.openFirstProduct();
    await productPage.addToCart.click();

    await homePage.navCart.click();
    await expect(checkoutPage.productTitle).toContainText(productName?.trim() ?? '');
    await expect(checkoutPage.productQuantity).toHaveValue('1');
    await expect(checkoutPage.cartTotal).toBeVisible();
  });
});
