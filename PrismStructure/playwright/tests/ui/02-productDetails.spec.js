// @ts-check
// Demo order: 02 — guest product details
const { test, expect } = require('../../fixtures/demoTest');
const { openInStockProductFromSearch } = require('../../helpers/uiFlows');

/** Manual traceability: TC-PRD-001 | Regression */
test.describe('Product Details @regression', () => {
  test('TC-UI-PRD-001: View complete product details from search results', async ({ page }) => {
    const { productPage } = await openInStockProductFromSearch(page);

    await expect(productPage.productName).not.toBeEmpty();
    await expect(productPage.unitPrice).toBeVisible();
    await expect(productPage.description).not.toBeEmpty();
    await expect(productPage.outOfStock).toHaveCount(0);
    await expect(productPage.addToCart).toBeEnabled();
  });
});
