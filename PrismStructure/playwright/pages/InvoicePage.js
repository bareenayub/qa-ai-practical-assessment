const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class InvoicePage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.getByTestId('page-title');
    this.invoiceNumber = page.getByTestId('invoice-number');
    this.invoiceDate = page.getByTestId('invoice-date');
    this.total = page.getByTestId('total');
    this.paymentMethod = page.getByTestId('payment-method');
    this.downloadInvoice = page.getByTestId('download-invoice');
    this.detailsLinks = page.getByRole('link', { name: 'Details' });
  }

  async openList() {
    await this.goto('/account/invoices');
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async waitForInvoiceRow(timeout = 10_000) {
    await expect(this.detailsLinks.first()).toBeVisible({ timeout });
  }

  async openLatestInvoice() {
    await this.waitForInvoiceRow();
    await this.detailsLinks.first().click();
    await this.invoiceNumber.waitFor({ state: 'visible' });
  }

  async openInvoiceByNumber(invoiceNumber) {
    const invoiceRow = this.page.getByRole('row').filter({ hasText: invoiceNumber });
    await expect(invoiceRow).toBeVisible({ timeout: 10_000 });
    await invoiceRow.getByRole('link', { name: 'Details' }).click();
    await expect(this.invoiceNumber).toHaveValue(invoiceNumber);
  }
}

module.exports = { InvoicePage };
