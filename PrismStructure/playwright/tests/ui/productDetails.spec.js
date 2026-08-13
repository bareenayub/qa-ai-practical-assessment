// @ts-check
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');

/**
 * Manual traceability: TC-PRD-001
 * Module: Product Details | Type: Regression
 */
test.describe('Product Details @regression', () => {
  test('TC-UI-PRD-001: View complete product details from search results', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);

    await homePage.open();
    await homePage.search('Pliers');
    await homePage.openFirstProduct();
    await productPage.waitForLoaded();

    await expect(productPage.productName).not.toBeEmpty();
    await expect(productPage.unitPrice).toBeVisible();
    await expect(productPage.description).not.toBeEmpty();
    await expect(productPage.outOfStock).toHaveCount(0);
    await expect(productPage.addToCart).toBeEnabled();
  });
});
