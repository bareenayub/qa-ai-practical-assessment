// @ts-check
// Demo order: 01 — guest search
const { test, expect } = require('../../fixtures/demoTest');
const { HomePage } = require('../../pages/HomePage');

/** Manual traceability: TC-SRH-001 | Regression */
test.describe('Product Search @regression', () => {
  test('TC-UI-SRH-001: Search returns matching products for a valid keyword', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.search('Hammer');

    const firstProduct = homePage.productCards.first();
    await expect(firstProduct).toBeVisible();
    await expect(firstProduct.getByTestId('product-name')).toContainText(/hammer/i);
    await expect(firstProduct.getByTestId('product-price')).toBeVisible();
  });
});
