const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.proceedStep1 = page.getByTestId('proceed-1');
    this.proceedStep2 = page.getByTestId('proceed-2');
    this.proceedStep3 = page.getByTestId('proceed-3');
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.loginSubmit = page.getByRole('button', { name: /^login$/i });
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.houseNumber = page.getByTestId('house_number');
    this.street = page.getByTestId('street');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.paymentMethod = page.getByTestId('payment-method');
    this.finishButton = page.getByTestId('finish');
    this.paymentSuccessMessage = page.getByTestId('payment-success-message');
    this.productTitle = page.getByTestId('product-title');
    this.productQuantity = page.getByTestId('product-quantity');
    this.cartTotal = page.getByTestId('cart-total');
    this.orderConfirmation = page.locator('#order-confirmation');
    this.invoiceNumber = page.locator('#invoice-number');
  }

  async waitForCartStep() {
    await this.productTitle.waitFor({ state: 'visible', timeout: 20_000 });
  }

  async clickWizardNext(stepNumber) {
    const button = this.page.getByTestId(`proceed-${stepNumber}`);
    await button.waitFor({ state: 'visible', timeout: 20_000 });
    await button.click();
  }

  async loginInCheckout(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
  }

  async fillAddress(address) {
    await this.country.selectOption(address.country);
    await this.postalCode.fill(address.postal_code);
    if (await this.houseNumber.count()) {
      await this.houseNumber.fill(address.house_number);
    }
    await this.street.fill(address.street);
    await this.city.fill(address.city);
    await this.state.fill(address.state);
  }

  async proceedThroughWizard({ email, password, address }) {
    await this.waitForCartStep();
    await this.clickWizardNext(1);

    if (await this.emailInput.isVisible()) {
      await this.loginInCheckout(email, password);
    }

    if (await this.proceedStep2.isVisible()) {
      await this.proceedStep2.click();
    }

    if (await this.country.isVisible()) {
      await this.fillAddress(address);
    }

    await this.clickWizardNext(3);
  }

  /** Cash on Delivery requires two confirm clicks per application behavior. */
  async completeCashOnDelivery() {
    await this.paymentMethod.selectOption('cash-on-delivery');
    await this.finishButton.click();
    await this.paymentSuccessMessage.waitFor({ state: 'visible' });
    await this.finishButton.click();
    await this.orderConfirmation.waitFor({ state: 'visible' });
  }
}

module.exports = { CheckoutPage };
