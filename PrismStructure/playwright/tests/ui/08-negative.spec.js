// @ts-check
// Demo order: 08 — negative scenarios (last)
const { test, expect } = require('../../fixtures/demoTest');
const { LoginPage } = require('../../pages/LoginPage');
const { DEFAULT_CUSTOMER } = require('../../fixtures/testData');
const { loginAsSuiteUser, addFirstSearchResultToCart, openCart } = require('../../helpers/uiFlows');

/** Manual traceability: TC-NEG-001 | Regression */
test.describe('Negative Scenarios @regression', () => {
  test('TC-UI-NEG-001: Reject invalid login and prevent invalid cart quantity update', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.step('TC-NEG-001 Part A: Invalid password');
    await loginPage.open();
    await loginPage.attemptLogin(DEFAULT_CUSTOMER.email, 'wrong-password-123', { skipDemoPause: true });
    await expect(loginPage.loginError).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.step('TC-NEG-001 Part A: Non-existent email');
    await loginPage.attemptLogin('not-a-real-user@example.com', 'any-password', { skipDemoPause: true });
    await expect(loginPage.loginError).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.step('TC-NEG-001 Part B: Cart quantity guard');
    await loginAsSuiteUser(page);
    await addFirstSearchResultToCart(page, 'Hammer');

    const checkoutPage = await openCart(page);
    await checkoutPage.productQuantity.first().fill('0');
    await checkoutPage.productQuantity.first().blur();
    await expect(checkoutPage.productQuantity.first()).toHaveValue('1');
  });
});
