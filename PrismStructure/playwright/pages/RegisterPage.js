const { BasePage } = require('./BasePage');
const { demoPause } = require('../helpers/demoPause');

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
    await this.firstName.fill(user.first_name);
    await this.lastName.fill(user.last_name);
    await this.dob.fill(user.dob);
    await this.country.selectOption(user.country);
    await this.postalCode.fill(user.postal_code);
    await this.houseNumber.fill(user.house_number);
    await this.street.fill(user.street);
    await this.city.fill(user.city);
    await this.setStateValue(user.state);
    await this.phone.fill(user.phone);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await demoPause(this.page, 1200);

    await Promise.all([
      this.page.waitForURL(/\/auth\/login/, { timeout: 30_000 }),
      this.submitButton.click(),
    ]);
  }
}

module.exports = { RegisterPage };
