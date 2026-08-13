// @ts-check
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');

/**
 * Manual traceability: TC-SRH-001
 * Module: Search Product | Type: Regression
 */
test.describe('Product Search @regression', () => {
  test('TC-UI-SRH-001: Search returns matching products for a valid keyword', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.search('Hammer');

    await expect(homePage.searchTerm).toContainText(/hammer/i);
    await expect(homePage.productCards.first()).toBeVisible();
    await expect(homePage.productCards.first().getByTestId('product-name')).toBeVisible();
    await expect(homePage.productCards.first().getByTestId('product-price')).toBeVisible();
    await expect(homePage.noResults).toHaveCount(0);
  });
});
