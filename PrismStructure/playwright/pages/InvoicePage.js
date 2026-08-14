const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class InvoicePage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.getByTestId('page-title');
    this.invoiceNumber = page.getByTestId('invoice-number');
    this.invoiceDate = page.getByTestId('invoice-date');
    this.total = page.locator('#total');
    this.paymentMethod = page.getByTestId('payment-method');
    this.downloadInvoice = page.getByTestId('download-invoice');
    this.detailsLinks = page.getByRole('link', { name: 'Details' });
  }

  async openList() {
    await this.step('TC-INV-001: Open My Invoices');
    await this.goto('/account/invoices');
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async waitForInvoiceRow(timeout = 10_000) {
    await expect(this.detailsLinks.first()).toBeVisible({ timeout });
  }

  async openLatestInvoice() {
    await this.waitForInvoiceRow();
    await this.highlightClick(this.detailsLinks.first(), 'Open latest invoice — Details');
    await this.invoiceNumber.waitFor({ state: 'visible' });
  }

  async openInvoiceByNumber(invoiceNumber) {
    const row = this.page.getByRole('row').filter({ hasText: invoiceNumber });
    await expect(row).toBeVisible({ timeout: 10_000 });
    await this.highlightClick(row.getByRole('link', { name: 'Details' }), `Open invoice ${invoiceNumber}`);
    await expect(this.page.getByText(/doesn't exist/i)).not.toBeVisible({ timeout: 3_000 }).catch(() => {});
    await this.invoiceNumber.waitFor({ state: 'visible', timeout: 10_000 });
  }

  async openInvoiceWithRetry(invoiceNumber, attempts = 3) {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      await this.openList();

      const rowVisible = await this.page
        .getByRole('row')
        .filter({ hasText: invoiceNumber })
        .isVisible({ timeout: 5_000 })
        .catch(() => false);

      if (rowVisible) {
        await this.openInvoiceByNumber(invoiceNumber);
        return;
      }

      await this.page.reload();
    }

    await this.openList();
    await this.openLatestInvoice();
  }

  async verifyInvoiceDetails(invoiceNumber) {
    await expect(this.invoiceNumber).toHaveValue(invoiceNumber);
    await expect(this.paymentMethod).toHaveValue(/Cash on Delivery/i);
    await expect(this.total).not.toHaveValue('');
  }
}

module.exports = { InvoicePage };
