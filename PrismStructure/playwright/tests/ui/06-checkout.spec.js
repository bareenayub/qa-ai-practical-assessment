// @ts-check
// Demo order: 06 — COD checkout
const { test, expect } = require('../../fixtures/demoTest');
const { loginAsSuiteUser, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/** Manual traceability: TC-CHK-001 | Smoke */
test.describe('Checkout @smoke', () => {
  test('TC-UI-CHK-001: Complete checkout using Cash on Delivery payment', async ({ page }) => {
    test.setTimeout(150_000);

    const customer = await loginAsSuiteUser(page);
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
