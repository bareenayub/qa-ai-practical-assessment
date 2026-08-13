// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { DEFAULT_CUSTOMER, DEFAULT_ADDRESS } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-CHK-001
 * Module: Checkout | Type: Smoke
 */
test.describe('Checkout @smoke', () => {
  test('TC-UI-CHK-001: Complete checkout using Cash on Delivery payment', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login(DEFAULT_CUSTOMER.email, DEFAULT_CUSTOMER.password);

    await homePage.open();
    await homePage.search('Hammer');
    await homePage.openFirstProduct();
    await productPage.addToCart.click();

    await homePage.navCart.click();
    await checkoutPage.waitForCartStep();
    await checkoutPage.proceedThroughWizard({
      email: DEFAULT_CUSTOMER.email,
      password: DEFAULT_CUSTOMER.password,
      address: DEFAULT_ADDRESS,
    });
    await checkoutPage.completeCashOnDelivery();

    await expect(checkoutPage.orderConfirmation).toBeVisible();
    await expect(checkoutPage.invoiceNumber).not.toBeEmpty();
    await expect(checkoutPage.paymentMethod).toHaveValue('cash-on-delivery');
  });
});
