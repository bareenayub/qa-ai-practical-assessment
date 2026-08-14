/**
 * Reusable UI flows for Toolshop tests.
 *
 * Manual CSV alignment (8 UI specs = 8 manual cases):
 * TC-UI-REG-001 → TC-REG-001 | TC-UI-LOG-001 → TC-LOG-001
 * TC-UI-SRH-001 → TC-SRH-001 | TC-UI-PRD-001 → TC-PRD-001
 * TC-UI-CRT-001 → TC-CRT-001 | TC-UI-CHK-001 → TC-CHK-001
 * TC-UI-INV-001 → TC-INV-001 | TC-UI-NEG-001 → TC-NEG-001
 */

const { expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { HomePage } = require('../pages/HomePage');
const { ProductPage } = require('../pages/ProductPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { showStepBanner } = require('./demoPause');
const { DEFAULT_CUSTOMER, buildUiRegistrationUser, IN_STOCK_SEARCH_KEYWORDS, DEFAULT_ADDRESS } = require('../fixtures/testData');

const FALLBACK_CUSTOMER = {
  email: 'customer2@practicesoftwaretesting.com',
  password: 'welcome01',
};

function withCheckoutAddress(customer) {
  return { ...DEFAULT_ADDRESS, ...customer, ...(customer.address || {}) };
}

/** TC-REG-001 precondition: register only (ends on login page). */
async function registerUser(page) {
  const user = buildUiRegistrationUser();
  const registerPage = new RegisterPage(page);

  await registerPage.step('TC-REG-001: Open registration form');
  await registerPage.open();
  await registerPage.register(user);
  await expect(page).toHaveURL(/\/auth\/login/, { timeout: 20_000 });

  return user;
}

/** TC-LOG-001 steps: home → sign in → login with known credentials. */
async function loginWithCredentials(page, user) {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  await homePage.step('TC-LOG-001: Open home page');
  await homePage.open();
  await loginPage.step('TC-LOG-001: Open Sign In');
  await loginPage.open();
  await loginPage.login(user.email, user.password);

  return user;
}

/**
 * Authenticated session for cart/checkout/invoice tests.
 * Tries demo accounts first; if login fails, registers a fresh user and logs in.
 */
async function ensureLoggedIn(page) {
  const loginPage = new LoginPage(page);

  for (const customer of [DEFAULT_CUSTOMER, FALLBACK_CUSTOMER]) {
    await loginPage.step(`Sign in with demo account (${customer.email})`);
    await loginPage.open();

    if (page.url().includes('/account') && !page.url().includes('/auth/')) {
      return withCheckoutAddress(customer);
    }

    await loginPage.attemptLogin(customer.email, customer.password);

    const reachedAccount = await page
      .waitForURL(/\/account/, { timeout: 4_000 })
      .then(() => true)
      .catch(() => false);

    if (reachedAccount) {
      return withCheckoutAddress(customer);
    }
  }

  await showStepBanner(page, 'Demo login unavailable — registering a fresh test user');
  const user = await registerUser(page);
  await loginPage.login(user.email, user.password);
  return withCheckoutAddress(user);
}

/** Register + login in one flow (used by checkout/invoice E2E paths). */
async function registerAndLogin(page) {
  const user = await registerUser(page);
  const loginPage = new LoginPage(page);

  await loginPage.step('Sign in with newly registered credentials');
  await loginPage.login(user.email, user.password);

  return withCheckoutAddress(user);
}

/** @deprecated Alias for ensureLoggedIn. */
const loginAsCustomer = ensureLoggedIn;

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
      const card = homePage.productCards.nth(index);
      await homePage.highlightClick(card, `Open product card ${index + 1} from search results`);
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

  await productPage.highlightClick(productPage.addToCart, 'Click Add to Cart');

  return productName;
}

async function openCart(page) {
  const homePage = new HomePage(page);
  const checkoutPage = new CheckoutPage(page);

  await homePage.highlightClick(homePage.navCart, 'Open cart from navigation');
  await checkoutPage.waitForCartStep();

  return checkoutPage;
}

module.exports = {
  registerUser,
  loginWithCredentials,
  ensureLoggedIn,
  registerAndLogin,
  loginAsCustomer,
  openInStockProductFromSearch,
  addFirstSearchResultToCart,
  openCart,
};
