import { navigateTo } from "../../index.js";
import UserStateHelper from "../../helper/state/UserStateHelper.js";
import AuthStateHelper from "../../helper/state/AuthStateHelper.js";

export default class Header {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.render();
  }

  render() {
    this.container.innerHTML = `
        <header class="header-container">
            <div class="header-logo">Sistema de monitoreo y control de ganado</div>
            <nav class="header-nav">
            <a href="/" data-link>Inicio</a>
                  <a href="/add-animal" data-link>Animales</a>
                  <a href="/add-checkpoint" data-link>Checkpoints</a>
                <button class="header-button" onclick="logout()">Cerrar Sesion</button>
            </nav>
        </header>`;
  }

}
window.logout = () => {
  AuthStateHelper.deleteAuth();
  UserStateHelper.deleteUser();
  navigateTo('/login');
};