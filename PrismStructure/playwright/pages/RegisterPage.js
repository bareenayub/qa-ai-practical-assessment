const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.form = page.getByTestId('register-form');
    this.firstName = page.getByTestId('first-name');
    this.lastName = page.getByTestId('last-name');
    this.dob = page.getByTestId('dob');
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.houseNumber = page.getByTestId('house_number');
    this.street = page.getByTestId('street');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.phone = page.getByTestId('phone');
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.submitButton = page.getByTestId('register-submit');
  }

  async open() {
    try {
      await this.goto('/auth/register');
    } catch (error) {
      if (!String(error.message).includes('interrupted')) {
        throw error;
      }
    }

    await this.form.waitFor({ state: 'visible', timeout: 30_000 });
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

  async register(user) {
    await this.highlightFill(this.firstName, user.first_name, 'Enter first name');
    await this.highlightFill(this.lastName, user.last_name, 'Enter last name');
    await this.highlightFill(this.dob, user.dob, 'Enter date of birth');
    await this.country.selectOption(user.country);
    await this.highlightFill(this.postalCode, user.postal_code, 'Enter postal code');
    await this.highlightFill(this.houseNumber, String(user.house_number), 'Enter house number');
    await this.houseNumber.press('Tab');

    const streetFilled = await this.street
      .inputValue()
      .then((value) => value.trim().length > 0)
      .catch(() => false);

    if (!streetFilled) {
      await this.highlightFill(this.street, user.street, 'Enter street');
      await this.highlightFill(this.city, user.city, 'Enter city');
      await this.setStateValue(user.state);
      await this.postalCode.press('Tab');
    } else {
      const stateValue = await this.state.inputValue().catch(() => '');
      if (!stateValue.trim()) {
        await this.setStateValue(user.state);
      }
    }

    await this.highlightFill(this.phone, user.phone, 'Enter phone');
    await this.highlightFill(this.email, user.email, 'Enter email');
    await this.highlightFill(this.password, user.password, 'Enter password');
    await this.pauseBeforeSubmit('Review registration form, then click Submit');
    await this.submitRegistration();
  }

  async submitRegistration() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await expect(this.submitButton).toBeEnabled({ timeout: 10_000 });

    const registerResponse = this.page
      .waitForResponse(
        (response) => response.url().includes('/users') && response.request().method() === 'POST',
        { timeout: 45_000 },
      )
      .catch(() => null);

    await Promise.all([
      registerResponse,
      this.highlightClick(this.submitButton, 'Submit registration'),
    ]);

    const reachedLogin = await this.page
      .waitForURL(/\/auth\/login/, { timeout: 30_000 })
      .then(() => true)
      .catch(() => false);

    if (reachedLogin) {
      return;
    }

    await expect(this.submitButton).toBeEnabled({ timeout: 5_000 });
    await this.highlightClick(this.submitButton, 'Retry registration submit');
    await this.page.waitForURL(/\/auth\/login/, { timeout: 30_000 });
  }
}

module.exports = { RegisterPage };
