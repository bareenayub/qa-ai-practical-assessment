// @ts-check
// Demo order: 05 — add to cart
const { test, expect } = require('../../fixtures/demoTest');
const { loginAsSuiteUser, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/** Manual traceability: TC-CRT-001 | Smoke */
test.describe('Add to Cart @smoke', () => {
  test('TC-UI-CRT-001: Add a single in-stock product to cart while logged in', async ({ page }) => {
    await loginAsSuiteUser(page);
    const productName = await addFirstSearchResultToCart(page, 'Hammer');
    const checkoutPage = await openCart(page);

    await expect(
      checkoutPage.productTitle.filter({ hasText: productName }),
    ).toBeVisible();
    await expect(checkoutPage.productQuantity.first()).toHaveValue('1');
    await expect(checkoutPage.cartTotal).toBeVisible();
  });
});
