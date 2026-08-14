// @ts-check
const { test, expect } = require('@playwright/test');
const { openInStockProductFromSearch } = require('../../helpers/uiFlows');

/**
 * Manual traceability: TC-PRD-001
 * Module: Product Details | Type: Regression
 * Scope: product detail page (name, price, description, stock, Add to Cart).
 * Different from TC-UI-SRH-001, which only validates the search results list.
 */
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
