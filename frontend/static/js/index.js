import AnimalLocationPage from "./pages/AnimalLocationPage.js";
import AnimalManagementPage from "./pages/AnimalManagementPage.js";
import CheckpointManagementPage from "./pages/CheckpointManagementPage.js";
import NotFoundPage from "./pages/NotFoundPage.js";
import Header from "./components/layouts/Header.js";

//Funcion para navegar entre paginas
export const navigateTo = (url) => {
  history.pushState({}, "", url);
  console.log(url);
  loadPage();
};

//Funcion para manejar el enrutamiento y carga de la pagina
function loadPage() {
  // Cargar el header en el contenedor principal
  new Header("header-container");

  // Cargar la página según la ruta
  const path = location.pathname;
  if (path === "/") {
    new AnimalLocationPage("layout-content");
  } else if (path === "/add-animal") {
    new AnimalManagementPage("layout-content");
  } else if (path === "/add-checkpoint") {
    new CheckpointManagementPage("layout-content");
  } else {
    new NotFoundPage("layout-content");
  }
}

// Manejador para enlaces de navegación
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  // Cargar la primera página
  loadPage();
});

// Cargar la página correspondiente en eventos de navegación del historial
window.onpopstate = loadPage;
