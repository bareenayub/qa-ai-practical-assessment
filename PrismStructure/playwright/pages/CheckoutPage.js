const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { InvoicePage } = require('./InvoicePage');
const { highlightLocator, isHeadedRun, clearHighlights, demoPause, pauseForInvoiceView } = require('../helpers/demoPause');

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
    this.lastInvoiceId = null;
    this.lastInvoiceNumber = null;
  }

  confirmButton() {
    return this.page
      .getByRole('button', { name: /^confirm$/i })
      .or(this.page.getByTestId('finish'))
      .first();
  }

  async waitForCartStep() {
    await this.productTitle.first().waitFor({ state: 'visible', timeout: 20_000 });
  }

  async clickProceed(stepNumber) {
    const button = this.page.getByTestId(`proceed-${stepNumber}`);
    await expect(button).toBeEnabled({ timeout: 20_000 });
    await this.highlightClick(button, `Proceed to checkout — step ${stepNumber}`);
  }

  async loginInCheckout(email, password) {
    await this.highlightFill(this.emailInput, email, 'Checkout sign-in: enter email');
    await this.highlightFill(this.passwordInput, password, 'Checkout sign-in: enter password');
    await this.pauseBeforeSubmit('Review checkout login, then click Login');
    await this.highlightClick(this.loginSubmit, 'Checkout sign-in: click Login');

    await this.page.waitForURL(/\/checkout/, { timeout: 15_000 }).catch(() => {});
    await this.proceedStep2.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
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

  addressFromCustomer(customer) {
    const address = customer.address || customer;
    return {
      country: address.country || customer.country,
      postal_code: address.postal_code || customer.postal_code,
      house_number: address.house_number || customer.house_number,
      street: address.street || customer.street,
      city: address.city || customer.city,
      state: address.state || customer.state,
    };
  }

  async fillAddress(address) {
    await this.step('TC-CHK-001: Enter billing address');
    await this.country.selectOption(address.country);
    await expect(this.postalCode).toBeVisible({ timeout: 10_000 });
    await expect(this.houseNumber).toBeVisible({ timeout: 10_000 });

    await this.highlightFill(this.postalCode, address.postal_code, 'Enter postal code');
    await this.highlightFill(this.houseNumber, String(address.house_number), 'Enter house number');
    await this.houseNumber.press('Tab');

    const streetFilled = await this.street
      .inputValue()
      .then((value) => value.trim().length > 0)
      .catch(() => false);

    if (!streetFilled) {
      await this.highlightFill(this.street, address.street, 'Enter street');
      await this.highlightFill(this.city, address.city, 'Enter city');
      await this.setStateValue(address.state);
      await this.postalCode.press('Tab');
    } else {
      await this.state.waitFor({ state: 'visible' });
      const stateValue = await this.state.inputValue().catch(() => '');
      if (!stateValue.trim()) {
        await this.setStateValue(address.state);
      }
    }
  }

  async advanceFromSignInStep(email, password) {
    if (await this.emailInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.loginInCheckout(email, password);
    }

    if (await this.proceedStep2.isEnabled({ timeout: 8_000 }).catch(() => false)) {
      await this.highlightClick(this.proceedStep2, 'Proceed past sign-in step');
      return;
    }

    if (await this.alreadyLoggedInProceed.isEnabled({ timeout: 8_000 }).catch(() => false)) {
      await this.highlightClick(this.alreadyLoggedInProceed, 'Proceed to checkout (already signed in)');
    }
  }

  async proceedThroughWizard({ email, password, address }) {
    await this.step('TC-CHK-001: Open cart and start checkout');
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
    await this.highlightClick(this.proceedStep3, 'Proceed to payment step');
  }

  /** COD: 1st Confirm validates payment, 2nd Confirm creates the invoice. */
  async completeCashOnDelivery() {
    this.lastInvoiceId = null;
    this.lastInvoiceNumber = null;

    await this.selectPaymentMethod('cash-on-delivery');
    await this.clickConfirmWithLabel('Confirm payment check (1st Confirm)');
    await expect(this.page.getByText(/payment was successful/i)).toBeVisible({ timeout: 15_000 });
    await expect(this.confirmButton()).toBeEnabled({ timeout: 10_000 });

    await this.submitOrderConfirm();

    if (!this.lastInvoiceNumber && (await this.confirmButton().isVisible({ timeout: 2_000 }).catch(() => false))) {
      await this.submitOrderConfirm();
    }

    if (!this.lastInvoiceNumber) {
      try {
        await this.getInvoiceNumber();
      } catch {
        // Fall through to assertion below.
      }
    }

    expect(this.lastInvoiceNumber, 'Invoice number should be created after COD checkout').toBeTruthy();
  }

  async selectPaymentMethod(value) {
    await this.step('TC-CHK-001: Select Cash on Delivery');
    await this.paymentMethod.selectOption(value);
    await expect(this.paymentMethod).toHaveValue(value);
  }

  async clickConfirmWithLabel(label) {
    const confirmButton = this.confirmButton();
    await expect(confirmButton).toBeEnabled({ timeout: 15_000 });

    if (isHeadedRun()) {
      await highlightLocator(this.page, confirmButton, label);
      await confirmButton.click();
      await demoPause(this.page, 500);
      await clearHighlights(this.page);
      return;
    }

    await confirmButton.click();
  }

  async submitOrderConfirm() {
    const confirmButton = this.confirmButton();
    await expect(confirmButton).toBeEnabled({ timeout: 15_000 });
    await confirmButton.scrollIntoViewIfNeeded();

    if (isHeadedRun()) {
      await highlightLocator(this.page, confirmButton, 'Confirm order and create invoice (2nd Confirm)');
    }

    const response = await Promise.all([
      this.page
        .waitForResponse((res) => this.invoicePostMatcher(res), { timeout: 30_000 })
        .catch(() => null),
      confirmButton.click(),
    ]).then(([invoiceResponse]) => invoiceResponse);

    if (response) {
      const body = await response.json();
      this.lastInvoiceId = body.id ?? null;
      this.lastInvoiceNumber = body.invoice_number || body.invoiceNumber || null;
    }

    await this.readInvoiceNumberFromPage();

    if (!this.lastInvoiceNumber) {
      await expect(this.page.locator('#invoice-number, [data-test="invoice-number"]'))
        .toBeVisible({ timeout: 8_000 })
        .catch(() => {});
      await this.readInvoiceNumberFromPage();
    }

    if (this.lastInvoiceNumber) {
      await pauseForInvoiceView(this.page, `Order complete — invoice ${this.lastInvoiceNumber}`);
    }

    if (isHeadedRun()) {
      await clearHighlights(this.page);
    }
  }

  invoicePostMatcher(response) {
    return (
      response.url().includes('/invoices') &&
      response.request().method() === 'POST' &&
      [200, 201].includes(response.status())
    );
  }

  async readInvoiceNumberFromPage() {
    if (this.lastInvoiceNumber) {
      return;
    }

    const invoiceOnPage = this.page.locator('#invoice-number, [data-test="invoice-number"]').first();
    if (await invoiceOnPage.isVisible({ timeout: 10_000 }).catch(() => false)) {
      const tagName = await invoiceOnPage.evaluate((el) => el.tagName.toLowerCase());
      this.lastInvoiceNumber =
        tagName === 'input'
          ? (await invoiceOnPage.inputValue()).trim()
          : (await invoiceOnPage.textContent())?.trim() ?? '';
    }
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
