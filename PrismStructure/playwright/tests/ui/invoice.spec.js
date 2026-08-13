// @ts-check
const { test, expect } = require('@playwright/test');
const { DEFAULT_CUSTOMER, DEFAULT_ADDRESS } = require('../../fixtures/testData');
const { HomePage } = require('../../pages/HomePage');
const { InvoicePage } = require('../../pages/InvoicePage');
const { loginAsCustomer, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/** Manual traceability: TC-INV-001 | Regression */
test.describe('Invoice Verification @regression', () => {
  test('TC-UI-INV-001: Verify invoice details after successful COD order', async ({ page }) => {
    const homePage = new HomePage(page);
    const invoicePage = new InvoicePage(page);

    await loginAsCustomer(page);
    await addFirstSearchResultToCart(page, 'Hammer');
    const checkoutPage = await openCart(page);

    await checkoutPage.proceedThroughWizard({
      email: DEFAULT_CUSTOMER.email,
      password: DEFAULT_CUSTOMER.password,
      address: DEFAULT_ADDRESS,
    });
    await checkoutPage.completeCashOnDelivery();

    const invoiceNo = await checkoutPage.getInvoiceNumber();
    expect(invoiceNo).toBeTruthy();

    await homePage.open();
    await homePage.openMyInvoices();
    await invoicePage.openLatestInvoice();

    await expect(invoicePage.invoiceNumber).toHaveValue(invoiceNo);
    await expect(invoicePage.paymentMethod).toHaveValue(/Cash on Delivery/i);
    await expect(invoicePage.total).not.toBeEmpty();
  });
});
