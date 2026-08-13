/**
 * Reusable UI flows for Toolshop tests.
 */

const { LoginPage } = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { HomePage } = require('../pages/HomePage');
const { ProductPage } = require('../pages/ProductPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { DEFAULT_CUSTOMER, buildUiRegistrationUser } = require('../fixtures/testData');

const FALLBACK_CUSTOMER = {
  email: 'customer2@practicesoftwaretesting.com',
  password: 'welcome01',
};

/** Register a unique user and log in (most reliable for shared demo environment). */
async function registerAndLogin(page) {
  const user = buildUiRegistrationUser();
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);

  await registerPage.open();
  await registerPage.register(user);
  await loginPage.open();
  await loginPage.login(user.email, user.password);

  return user;
}

/** Log in using demo accounts, with fallback and fresh-user registration. */
async function loginAsCustomer(page) {
  const loginPage = new LoginPage(page);
  const candidates = [DEFAULT_CUSTOMER, FALLBACK_CUSTOMER];

  for (const customer of candidates) {
    await loginPage.open();
    await loginPage.emailInput.fill(customer.email);
    await loginPage.passwordInput.fill(customer.password);
    await loginPage.submitButton.click();

    const reachedAccount = await page
      .waitForURL(/\/account/, { timeout: 12_000 })
      .then(() => true)
      .catch(() => false);

    if (reachedAccount) {
      return customer;
    }
  }

  return registerAndLogin(page);
}

async function addFirstSearchResultToCart(page, keyword = 'Hammer') {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);

  await homePage.open();
  await homePage.search(keyword);
  await homePage.openFirstProduct();
  await productPage.waitForLoaded();

  const productName = (await productPage.productName.textContent())?.trim() ?? '';
  await productPage.addToCart.click();

  return productName;
}

async function openCart(page) {
  const homePage = new HomePage(page);
  const checkoutPage = new CheckoutPage(page);

  await homePage.navCart.click();
  await checkoutPage.waitForCartStep();

  return checkoutPage;
}

module.exports = {
  registerAndLogin,
  loginAsCustomer,
  addFirstSearchResultToCart,
  openCart,
};
