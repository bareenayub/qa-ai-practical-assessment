const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { HomePage } = require('./HomePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.proceedStep1 = page.getByTestId('proceed-1');
    this.proceedStep2 = page.getByTestId('proceed-2');
    this.proceedStep3 = page.getByTestId('proceed-3');
    this.alreadyLoggedInProceed = page.getByRole('button', { name: /proceed to checkout/i });
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
    this.productTitle = page.getByTestId('product-title');
    this.productQuantity = page.getByTestId('product-quantity');
    this.cartTotal = page.getByTestId('cart-total');
    this.lastInvoiceNumber = null;
  }

  confirmButton() {
    return this.page.getByRole('button', { name: /^confirm$/i });
  }

  async waitForCartStep() {
    await this.productTitle.first().waitFor({ state: 'visible', timeout: 20_000 });
  }

  async clickProceed(stepNumber) {
    const button = this.page.getByTestId(`proceed-${stepNumber}`);
    await expect(button).toBeEnabled({ timeout: 20_000 });
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

    if (await this.houseNumber.isVisible()) {
      await this.houseNumber.fill(address.house_number);
    }

    await this.street.fill(address.street);
    await this.city.fill(address.city);
    await this.state.fill(address.state);
  }

  async proceedThroughWizard({ email, password, address }) {
    await this.clickProceed(1);

    if (await this.emailInput.isVisible()) {
      await this.loginInCheckout(email, password);
    }

    if (await this.alreadyLoggedInProceed.isVisible()) {
      await this.alreadyLoggedInProceed.click();
    } else if (await this.proceedStep2.isVisible()) {
      await expect(this.proceedStep2).toBeEnabled();
      await this.proceedStep2.click();
    }

    if (await this.country.isVisible()) {
      await this.fillAddress(address);
    }

    await this.clickProceed(3);
  }

  /** COD: 1st Confirm validates payment, 2nd Confirm creates the invoice. */
  async completeCashOnDelivery() {
    await this.paymentMethod.selectOption('cash-on-delivery');

    await this.confirmButton().click();
    await expect(this.page.getByText(/payment was successful/i)).toBeVisible({ timeout: 20_000 });

    await expect(this.confirmButton()).toBeEnabled({ timeout: 15_000 });

    const invoiceRequest = this.page.waitForResponse(
      (response) =>
        response.url().toLowerCase().includes('invoice') &&
        response.request().method() === 'POST' &&
        [200, 201].includes(response.status()),
      { timeout: 45_000 },
    );

    await this.confirmButton().click();

    try {
      const response = await invoiceRequest;
      const body = await response.json();
      this.lastInvoiceNumber = body.invoice_number || body.invoiceNumber || body.id;
    } catch {
      // Invoice number will be resolved from My Invoices if not returned on the page.
    }
  }

  async getInvoiceNumber() {
    if (this.lastInvoiceNumber) {
      return String(this.lastInvoiceNumber);
    }

    const onPage = this.page.locator('#invoice-number, [data-test="invoice-number"]').first();
    if (await onPage.isVisible().catch(() => false)) {
      const tagName = await onPage.evaluate((el) => el.tagName.toLowerCase());
      if (tagName === 'input') {
        return (await onPage.inputValue()).trim();
      }
      return (await onPage.textContent())?.trim() ?? '';
    }

    const homePage = new HomePage(this.page);
    await homePage.openMyInvoices();
    await this.page.getByRole('link', { name: 'Details' }).first().click();
    return (await this.page.getByTestId('invoice-number').inputValue()).trim();
  }
}

module.exports = { CheckoutPage };
