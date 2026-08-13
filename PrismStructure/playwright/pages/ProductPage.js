const { BasePage } = require('./BasePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productName = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.offerPrice = page.getByTestId('offer-price');
    this.description = page.getByTestId('product-description');
    this.outOfStock = page.getByTestId('out-of-stock');
    this.quantity = page.getByTestId('quantity');
    this.addToCart = page.getByTestId('add-to-cart');
    this.productSpecs = page.getByTestId('product-specs');
  }

  async waitForLoaded() {
    await this.productName.waitFor({ state: 'visible' });
  }
}

module.exports = { ProductPage };
