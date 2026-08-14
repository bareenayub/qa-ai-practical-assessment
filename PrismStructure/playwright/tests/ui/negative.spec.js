// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DEFAULT_CUSTOMER } = require('../../fixtures/testData');
const { loginAsCustomer, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/** Manual traceability: TC-NEG-001 | Regression */
test.describe('Negative Scenarios @regression', () => {
  test('TC-UI-NEG-001: Reject invalid login and prevent invalid cart quantity update', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(DEFAULT_CUSTOMER.email, 'wrong-password-123', { expectSuccess: false });
    await expect(loginPage.loginError).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);

    await loginAsCustomer(page);
    await addFirstSearchResultToCart(page, 'Hammer');

    const checkoutPage = await openCart(page);
    await checkoutPage.productQuantity.first().fill('0');
    await checkoutPage.productQuantity.first().blur();
    await expect(checkoutPage.productQuantity.first()).toHaveValue('1');
  });
});
