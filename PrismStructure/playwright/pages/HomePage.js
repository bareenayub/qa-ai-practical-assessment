const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.searchTerm = page.getByTestId('search-term');
    this.searchResultCount = page.getByTestId('search-result-count');
    this.noResults = page.getByTestId('no-results');
    this.productCards = page.locator('[data-test^="product-"]');
    this.navSignIn = page.getByTestId('nav-sign-in');
    this.navCart = page.getByTestId('nav-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
    this.userMenu = page.locator('[data-test="nav-menu"], button[id*="navbarDropdown"]');
    this.navMyInvoices = page.getByTestId('nav-my-invoices');
  }

  async open() {
    await this.goto('/');
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async search(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchSubmit.click();
  }

  async openFirstProduct() {
    await this.productCards.first().click();
  }
}

module.exports = { HomePage };
