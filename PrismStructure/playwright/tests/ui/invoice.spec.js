// @ts-check
const { test, expect } = require('@playwright/test');
const { InvoicePage } = require('../../pages/InvoicePage');
const { registerAndLogin, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/**
 * Manual traceability: TC-INV-001 | Regression
 * Flow: login → cart → COD checkout → verify invoice details.
 */
test.describe('Invoice Verification @regression', () => {
  test('TC-UI-INV-001: Verify invoice details after successful COD order', async ({ page }) => {
    test.setTimeout(120_000);

    const invoicePage = new InvoicePage(page);

    const customer = await registerAndLogin(page);
    await addFirstSearchResultToCart(page);
    const checkoutPage = await openCart(page);

    await checkoutPage.proceedThroughWizard({
      email: customer.email,
      password: customer.password,
      address: checkoutPage.addressFromCustomer(customer),
    });
    await checkoutPage.completeCashOnDelivery();

    const invoiceNo = checkoutPage.lastInvoiceNumber;
    expect(invoiceNo).toBeTruthy();

    if (await invoicePage.invoiceNumber.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await invoicePage.verifyInvoiceDetails(invoiceNo);
      return;
    }

    await invoicePage.openInvoiceWithRetry(invoiceNo);
    await invoicePage.verifyInvoiceDetails(invoiceNo);
  });
});
