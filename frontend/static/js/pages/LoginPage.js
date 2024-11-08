import { navigateTo } from "../index.js";
import AuthAPIHelper from "../helper/api/AuthAPIHelper.js";
import { validateLogin } from "../helper/validations/authValidations.js";
import UserStateHelper from "../helper/state/UserStateHelper.js";
import AuthStateHelper from "../helper/state/AuthStateHelper.js";
import { setupTokenRefresh } from "../index.js";

export default class LoginPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadForm();
  }

  async loadForm() {
    this.render();
    this.addListener();
  }

  async handleSubmit(event) {
    try {
      event.preventDefault();
      const username = event.target.elements.id.value.trim();
      const password = event.target.elements.password.value.trim();
      validateLogin({ username, password });
      const userData = await AuthAPIHelper.login({ username, password });
      const { accessToken, refreshToken, ...rest } = userData;
      UserStateHelper.setUser(rest);
      AuthStateHelper.setAuth({ accessToken, refreshToken });
      navigateTo("/");
      console.log("los datos de usuario son:" + userData);

      window.removeEventListener("submit", this.handleSubmit);
    } catch (e) {
      alert("Usuario o contraseña incorrectos");
    }
    setupTokenRefresh();
  }

  /*   addListener() {
    window.addEventListener("submit", this.handleSubmit);
  } */

  addListener() {
    document
      .getElementById("login-form")
      .addEventListener("submit", (e) => this.handleSubmit(e));
  }

  render() {
    const formHtml = `
            <form id="login-form" class="login-form-container">
                <h2 class="login-form-title">Iniciar sesión</h2>
                <div class="input-container">
                    <label for="id" class="input-label">ID:</label>
                    <input type="text" id="id" name="id" class="input-field" required>
                </div>
                <div class="input-container">
                    <label for="password" class="input-label">Contraseña:</label>
                    <input type="password" id="password" name="password" class="input-field" required>
                </div>
                <button type="submit" form="login-form" class="form-submit-button">Iniciar sesión</button>
            </form>
        `;
    this.container.innerHTML = formHtml;
  }
}
