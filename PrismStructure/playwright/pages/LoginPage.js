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
  async attemptLogin(email, password, { submitLabel = 'Click Login / Sign In', skipDemoPause = false } = {}) {
    if (skipDemoPause) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.submitButton.click();
      return;
    }

    await this.highlightFill(this.emailInput, email, 'Enter registered email');
    await this.highlightFill(this.passwordInput, password, 'Enter password');
    await this.pauseBeforeSubmit('Review credentials, then click Login');
    await this.highlightClick(this.submitButton, submitLabel);
  }

  async login(email, password, { expectSuccess = true, submitLabel } = {}) {
    await this.attemptLogin(email, password, { submitLabel });

    if (expectSuccess) {
      await this.page.waitForURL(/\/account/, { timeout: 30_000 });
      return;
    }

    await this.loginError.waitFor({ state: 'visible', timeout: 8_000 });
  }
}

module.exports = { LoginPage };
