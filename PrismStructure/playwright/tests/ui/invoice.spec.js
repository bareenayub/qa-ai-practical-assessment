// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { InvoicePage } = require('../../pages/InvoicePage');
const { DEFAULT_CUSTOMER, DEFAULT_ADDRESS } = require('../../fixtures/testData');

/**
 * Manual traceability: TC-INV-001
 * Module: Invoice Verification | Type: Regression
 */
test.describe('Invoice Verification @regression', () => {
  test('TC-UI-INV-001: Verify invoice details after successful COD order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);
    const invoicePage = new InvoicePage(page);

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

    const invoiceNo = (await checkoutPage.invoiceNumber.textContent())?.trim();
    expect(invoiceNo).toBeTruthy();

    await homePage.navMyInvoices.click();
    await invoicePage.openLatestInvoice();

    await expect(invoicePage.invoiceNumber).toHaveValue(invoiceNo);
    await expect(invoicePage.paymentMethod).toHaveValue(/Cash on Delivery/i);
    await expect(invoicePage.total).not.toBeEmpty();
    await expect(invoicePage.invoiceDate).not.toBeEmpty();
  });
});
