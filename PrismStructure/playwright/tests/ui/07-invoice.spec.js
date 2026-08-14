// @ts-check
// Demo order: 07 — invoice verification
const { test, expect } = require('../../fixtures/demoTest');
const { InvoicePage } = require('../../pages/InvoicePage');
const { loginAsSuiteUser, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/** Manual traceability: TC-INV-001 | Regression */
test.describe('Invoice Verification @regression', () => {
  test('TC-UI-INV-001: Verify invoice details after successful COD order', async ({ page }) => {
    test.setTimeout(150_000);

    const invoicePage = new InvoicePage(page);

    const customer = await loginAsSuiteUser(page);
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
