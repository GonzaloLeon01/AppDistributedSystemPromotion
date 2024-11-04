/* Página para manejar rutas no encontradas (404). */

export default class NotFoundPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.render();
  }

  render() {
    const notFoundHtml = `
        <div class="not-found-container" style="text-align: center; margin-top: 50px;">
          <h1 style="font-size: 3rem; color: #555;">404 - ¡Uy! ¿Perdiste una vaca?</h1>
          <p style="font-size: 1.2rem; color: #888;">
            Parece que la página que estás buscando se ha escapado del corral. <br>
            Tal vez se fue a explorar algún otro pastizal...
          </p>
          <img src="https://media.giphy.com/media/26uflxcYs6vDNGH1i/giphy.gif" 
               alt="Cow running away" 
               style="width: 300px; margin: 20px auto;">
          <button onclick="window.history.back()" style="padding: 10px 20px; font-size: 1rem; background-color: #007BFF; color: white; border: none; cursor: pointer; border-radius: 5px;">
            Volver a intentar
          </button>
        </div>
      `;
    this.container.innerHTML = notFoundHtml;
  }
}
