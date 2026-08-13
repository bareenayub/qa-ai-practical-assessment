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
    await this.goto('/auth/register');
    await this.form.waitFor({ state: 'visible' });
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
    await this.state.fill(user.state);
    await this.phone.fill(user.phone);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.submitButton.click();
  }
}

module.exports = { RegisterPage };
