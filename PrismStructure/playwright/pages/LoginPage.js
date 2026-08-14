const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.submitButton = page.getByTestId('login-submit');
    this.loginError = page.getByTestId('login-error');
  }

  async open() {
    try {
      await this.goto('/auth/login');
    } catch (error) {
      if (!String(error.message).includes('interrupted')) {
        throw error;
      }
    }

    if (this.page.url().includes('/account')) {
      return;
    }

    await this.emailInput.waitFor({ state: 'visible' });
  }

  async login(email, password, { expectSuccess = true } = {}) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (expectSuccess) {
      await Promise.all([
        this.page.waitForURL(/\/account/, { timeout: 30_000 }),
        this.submitButton.click(),
      ]);
      return;
    }

    await this.submitButton.click();
    await this.loginError.waitFor({ state: 'visible', timeout: 8_000 });
  }
}

module.exports = { LoginPage };
