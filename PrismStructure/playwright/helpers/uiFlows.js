/**
 * Reusable UI flows for Toolshop tests.
 */

const { LoginPage } = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { HomePage } = require('../pages/HomePage');
const { ProductPage } = require('../pages/ProductPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { DEFAULT_CUSTOMER, buildUiRegistrationUser, IN_STOCK_SEARCH_KEYWORDS } = require('../fixtures/testData');

const FALLBACK_CUSTOMER = {
  email: 'customer2@practicesoftwaretesting.com',
  password: 'welcome01',
};

/** Register a unique user and log in (most reliable for shared demo environment). */
async function registerAndLogin(page) {
  const { expect } = require('@playwright/test');
  const user = buildUiRegistrationUser();
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);

  await registerPage.open();
  await registerPage.register(user);
  await expect(page).toHaveURL(/\/auth\/login/, { timeout: 20_000 });
  await loginPage.login(user.email, user.password);

  return user;
}

/** Log in using demo accounts, with fallback and fresh-user registration. */
async function loginAsCustomer(page) {
  const loginPage = new LoginPage(page);
  const candidates = [DEFAULT_CUSTOMER, FALLBACK_CUSTOMER];

  for (const customer of candidates) {
    await loginPage.open();

    if (page.url().includes('/account') && !page.url().includes('/auth/')) {
      return customer;
    }

    await loginPage.emailInput.fill(customer.email);
    await loginPage.passwordInput.fill(customer.password);
    await loginPage.submitButton.click();

    const reachedAccount = await page
      .waitForURL(/\/account/, { timeout: 2_000 })
      .then(() => true)
      .catch(() => false);

    if (reachedAccount) {
      return customer;
    }
  }

  return registerAndLogin(page);
}

/** Find and open a product that is currently in stock on the live catalog. */
async function openInStockProductFromSearch(page, keywords = IN_STOCK_SEARCH_KEYWORDS) {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const searchTerms = [...new Set(keywords)];

  for (const keyword of searchTerms) {
    await homePage.open();
    await homePage.search(keyword);

    const cardCount = await homePage.productCards.count();
    for (let index = 0; index < Math.min(cardCount, 4); index += 1) {
      await homePage.productCards.nth(index).click();
      await productPage.waitForLoaded();

      const canAdd = await productPage.addToCart.isEnabled({ timeout: 3_000 }).catch(() => false);
      if (canAdd) {
        const productName = (await productPage.productName.textContent())?.trim() ?? '';
        return { homePage, productPage, productName };
      }

      await page.goBack();
      await homePage.productCards.first().waitFor({ state: 'visible' });
    }
  }

  throw new Error(`No in-stock product found for keywords: ${searchTerms.join(', ')}`);
}

async function addFirstSearchResultToCart(page, keyword) {
  const searchTerms = keyword
    ? [...new Set([keyword, ...IN_STOCK_SEARCH_KEYWORDS])]
    : IN_STOCK_SEARCH_KEYWORDS;
  const { productPage, productName } = await openInStockProductFromSearch(page, searchTerms);

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
  openInStockProductFromSearch,
  addFirstSearchResultToCart,
  openCart,
};
