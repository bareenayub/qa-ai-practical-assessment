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

  /** Fill credentials and click Login without asserting navigation (for negative tests). */
  async attemptLogin(email, password) {
    await this.highlightFill(this.emailInput, email, 'Enter registered email');
    await this.highlightFill(this.passwordInput, password, 'Enter password');
    await this.highlightClick(this.submitButton, 'Click Login / Sign In');
  }

  async login(email, password, { expectSuccess = true } = {}) {
    await this.attemptLogin(email, password);

    if (expectSuccess) {
      await this.page.waitForURL(/\/account/, { timeout: 30_000 });
      return;
    }

    await this.loginError.waitFor({ state: 'visible', timeout: 8_000 });
  }
}

module.exports = { LoginPage };
