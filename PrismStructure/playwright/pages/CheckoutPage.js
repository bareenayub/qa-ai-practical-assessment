const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { InvoicePage } = require('./InvoicePage');

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

  async setStateValue(stateValue) {
    const tagName = await this.state.evaluate((el) => el.tagName.toLowerCase());
    if (tagName === 'select') {
      const matched = await this.state
        .selectOption({ label: stateValue })
        .then(() => true)
        .catch(() => false);
      if (!matched) {
        await this.state.selectOption({ label: /new york/i });
      }
      return;
    }

    await this.state.fill(stateValue);
  }

  async fillAddress(address) {
    await this.country.selectOption(address.country);
    await this.state.waitFor({ state: 'visible' });

    if (await this.houseNumber.isVisible()) {
      await this.houseNumber.fill(address.house_number);
    }

    await this.street.fill(address.street);
    await this.city.fill(address.city);
    await this.setStateValue(address.state);
    await this.postalCode.fill(address.postal_code);
    await this.postalCode.press('Tab');
  }

  async advanceFromSignInStep(email, password) {
    if (await this.emailInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.loginInCheckout(email, password);
    }

    if (await this.proceedStep2.isEnabled({ timeout: 5_000 }).catch(() => false)) {
      await this.proceedStep2.click();
      return;
    }

    if (await this.alreadyLoggedInProceed.isEnabled({ timeout: 5_000 }).catch(() => false)) {
      await this.alreadyLoggedInProceed.click();
    }
  }

  async proceedThroughWizard({ email, password, address }) {
    await this.clickProceed(1);
    await this.advanceFromSignInStep(email, password);

    if (await this.paymentMethod.isVisible({ timeout: 5_000 }).catch(() => false)) {
      return;
    }

    await expect(this.country).toBeVisible({ timeout: 10_000 });

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.fillAddress(address);
      if (await this.proceedStep3.isEnabled({ timeout: 3_000 }).catch(() => false)) {
        break;
      }
    }

    await expect(this.proceedStep3).toBeEnabled({ timeout: 20_000 });
    await this.proceedStep3.click();
  }

  addressFromCustomer(customer) {
    return {
      country: customer.country,
      postal_code: customer.postal_code,
      house_number: customer.house_number,
      street: customer.street,
      city: customer.city,
      state: customer.state,
    };
  }

  /** COD: 1st Confirm validates payment, 2nd Confirm creates the invoice. */
  async completeCashOnDelivery() {
    await this.paymentMethod.selectOption('cash-on-delivery');
    await expect(this.paymentMethod).toHaveValue('cash-on-delivery');

    await this.confirmButton().click();
    await expect(this.page.getByText(/payment was successful/i)).toBeVisible({ timeout: 15_000 });

    for (let attempt = 0; attempt < 2 && !this.lastInvoiceNumber; attempt += 1) {
      const confirmButton = this.confirmButton();
      await expect(confirmButton).toBeEnabled({ timeout: 10_000 });

      const invoiceRequest = this.page
        .waitForResponse(
          (response) =>
            /\/invoices/.test(response.url()) &&
            response.request().method() === 'POST' &&
            [200, 201].includes(response.status()),
          { timeout: 20_000 },
        )
        .catch(() => null);

      await confirmButton.click();

      const response = await invoiceRequest;
      if (response) {
        const body = await response.json();
        this.lastInvoiceNumber = body.invoice_number || body.invoiceNumber;
      }

      if (!this.lastInvoiceNumber) {
        const invoiceOnPage = this.page.locator('#invoice-number, [data-test="invoice-number"]').first();
        if (await invoiceOnPage.isVisible({ timeout: 5_000 }).catch(() => false)) {
          const tagName = await invoiceOnPage.evaluate((el) => el.tagName.toLowerCase());
          this.lastInvoiceNumber =
            tagName === 'input'
              ? (await invoiceOnPage.inputValue()).trim()
              : (await invoiceOnPage.textContent())?.trim() ?? '';
        }
      }
    }

    expect(this.lastInvoiceNumber, 'Invoice number should be created after COD checkout').toBeTruthy();
  }

  async getInvoiceNumber() {
    if (this.lastInvoiceNumber) {
      return String(this.lastInvoiceNumber);
    }

    const onPage = this.page.locator('#invoice-number, [data-test="invoice-number"]').first();
    if (await onPage.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const tagName = await onPage.evaluate((el) => el.tagName.toLowerCase());
      this.lastInvoiceNumber =
        tagName === 'input'
          ? (await onPage.inputValue()).trim()
          : (await onPage.textContent())?.trim() ?? '';
      return this.lastInvoiceNumber;
    }

    const invoicePage = new InvoicePage(this.page);
    await invoicePage.openList();
    await invoicePage.waitForInvoiceRow(8_000);
    await invoicePage.openLatestInvoice();
    this.lastInvoiceNumber = (await invoicePage.invoiceNumber.inputValue()).trim();
    return this.lastInvoiceNumber;
  }
}

module.exports = { CheckoutPage };
