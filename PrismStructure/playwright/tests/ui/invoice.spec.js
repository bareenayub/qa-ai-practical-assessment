// @ts-check
const { test, expect } = require('@playwright/test');
const { InvoicePage } = require('../../pages/InvoicePage');
const { registerAndLogin, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/**
 * Manual traceability: TC-INV-001 | Regression
 * Full purchase path: register → cart → COD checkout → invoice verification.
 */
test.describe('Invoice Verification @regression', () => {
  test('TC-UI-INV-001: Verify invoice details after successful COD order', async ({ page }) => {
    test.setTimeout(90_000);

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

    if (await invoicePage.invoiceNumber.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await expect(invoicePage.invoiceNumber).toHaveValue(invoiceNo);
      await expect(invoicePage.paymentMethod).toHaveValue(/Cash on Delivery/i);
      await expect(invoicePage.total).not.toBeEmpty();
      return;
    }

    await invoicePage.openList();
    await invoicePage.openInvoiceByNumber(invoiceNo);

    await expect(invoicePage.invoiceNumber).toHaveValue(invoiceNo);
    await expect(invoicePage.paymentMethod).toHaveValue(/Cash on Delivery/i);
    await expect(invoicePage.total).not.toBeEmpty();
  });
});
