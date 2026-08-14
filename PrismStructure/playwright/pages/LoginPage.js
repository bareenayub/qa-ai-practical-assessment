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
    await this.goto('/auth/login');
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
  }
}

module.exports = { LoginPage };
