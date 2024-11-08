import AnimalLocationPage from "./pages/AnimalLocationPage.js";
import AnimalManagementPage from "./pages/AnimalManagementPage.js";
import CheckpointManagementPage from "./pages/CheckpointManagementPage.js";
import LoginPage from "./pages/LoginPage.js";
import NotFoundPage from "./pages/NotFoundPage.js";
import Header from "./components/layouts/Header.js";
import AuthStateHelper from "./helper/state/AuthStateHelper.js";
import "./helper/api/AxiosRequestInterceptor.js"; // Importar el interceptor al inicio

//Funcion para navegar entre paginas
export const navigateTo = (url) => {
  history.pushState({}, "", url);
  console.log(url);
  loadPage();
};
const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  const isAuth = !!AuthStateHelper.getAccessToken();
  if (!isAuth && event.target.href !== "/login") {
    navigateTo("/login");
  } else {
    navigateTo(event.target.href);
  }
};

function loadLayout() {
  const isAuth = !!AuthStateHelper.getAccessToken();
  const headerContainer = document.getElementById("header-container");

  if (!isAuth && headerContainer) {
    // Eliminar contenido del header cuando no hay autenticación
    headerContainer.innerHTML = "";
  }
  if (isAuth) {
    new Header("header-container");
    return;
  }
  //new AuthLayout("container");
}
//Funcion para manejar el enrutamiento y carga de la pagina
function loadPage() {
  console.log("El token es:" + AuthStateHelper.getAccessToken());
  if (AuthStateHelper.isTokenExpired()) {
    AuthStateHelper.deleteAuth();
  }
  const isAuth = !!AuthStateHelper.getAccessToken();
  if (!isAuth) {
    history.pushState({}, "", "/login");
    return new LoginPage("layout-content");
  }
  loadLayout();
  // Cargar el header en el contenedor principal
  //new Header("header-container");
  // Cargar la página según la ruta
  const path = location.pathname;
  if (path === "/") {
    new AnimalLocationPage("layout-content");
  } else if (path === "/add-animal") {
    new AnimalManagementPage("layout-content");
  } else if (path === "/add-checkpoint") {
    new CheckpointManagementPage("layout-content");
  } else if (location.pathname === "/login") {
    new LoginPage("layout-content");
  } else {
    new NotFoundPage("layout-content");
  }
}
// Cargar la página correspondiente en eventos de navegación del historial
window.route = route;
window.onpopstate = loadPage;
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

async function refreshToken() {
  try {
    const refreshToken = AuthStateHelper.getRefreshToken();
    const response = await axios.post("http://localhost:4000/API/refresh", {
      refreshToken,
    });

    const { accessToken } = response.data;
    if (accessToken) {
      AuthStateHelper.setAuth({ ...AuthStateHelper.getAuth(), accessToken });
      console.log("Token renovado correctamente");
    } else {
      throw new Error("Error al renovar el token");
    }
  } catch (error) {
    console.error("No se pudo renovar el token", error);
    // Opcional: redirige al usuario a la página de inicio de sesión si no es posible renovar el token
    AuthStateHelper.deleteAuth();
    navigateTo("/login");
  }
}

export function setupTokenRefresh() {
  console.log("nunca entra");
  const refreshInterval = 60000; // Revisar cada minuto
  setInterval(() => {
    const expiryTime = AuthStateHelper.getExpiryTime();
    console.log(expiryTime);
    if (expiryTime) {
      const currentTime = Date.now();
      const timeRemaining = expiryTime - currentTime;

      // Si el token está a punto de expirar en menos de 1 minuto, solicita un nuevo token
      if (timeRemaining < 60000) {
        console.log("AAAAAAAAAAAAAAAAAAAA");
        console.log("Lanzando request refresh para obtener nuevo accesToken");
        refreshToken();
      }
    } else {
      AuthStateHelper.deleteAuth();
    }
  }, refreshInterval);
}
