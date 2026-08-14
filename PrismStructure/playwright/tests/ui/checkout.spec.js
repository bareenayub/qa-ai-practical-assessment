// @ts-check
const { test, expect } = require('@playwright/test');
const { registerAndLogin, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/** Manual traceability: TC-CHK-001 | Smoke
 * Uses fresh registration for a reliable COD checkout on the shared demo site.
 */
test.describe('Checkout @smoke', () => {
  test('TC-UI-CHK-001: Complete checkout using Cash on Delivery payment', async ({ page }) => {
    test.setTimeout(120_000);

    const customer = await registerAndLogin(page);
    await addFirstSearchResultToCart(page);
    const checkoutPage = await openCart(page);

    await checkoutPage.proceedThroughWizard({
      email: customer.email,
      password: customer.password,
      address: checkoutPage.addressFromCustomer(customer),
    });
    await checkoutPage.completeCashOnDelivery();

    expect(checkoutPage.lastInvoiceNumber).toBeTruthy();
  });
});
