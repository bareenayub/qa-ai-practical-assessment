const { BasePage } = require('./BasePage');
const { demoPause } = require('../helpers/demoPause');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.searchTerm = page.getByTestId('search-term');
    this.productCards = page.locator('[data-test^="product-"]');
    this.navCart = page.getByTestId('nav-cart');
    this.userMenu = page.locator('[data-test="nav-menu"], button[id*="navbarDropdown"]');
    this.navMyInvoices = page.getByTestId('nav-my-invoices');
  }

  async open() {
    await this.goto('/');
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async search(keyword) {
    await this.searchInput.fill(keyword);
    await demoPause(this.page, 1200);
    await this.searchSubmit.click();
    await this.productCards.first().waitFor({ state: 'visible' });
    await demoPause(this.page, 800);
  }

  async openFirstProduct() {
    await this.productCards.first().click();
  }

  async openMyInvoices() {
    await this.goto('/account/invoices');
    await this.page.getByTestId('page-title').waitFor({ state: 'visible', timeout: 20_000 });
  }
}

module.exports = { HomePage };
