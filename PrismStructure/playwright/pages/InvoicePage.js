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

  async openLatestInvoice() {
    await this.detailsLinks.first().click();
    await this.invoiceNumber.waitFor({ state: 'visible' });
  }
}

module.exports = { InvoicePage };
