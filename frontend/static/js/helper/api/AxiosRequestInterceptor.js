import AuthStateHelper from "../state/AuthStateHelper.js";

axios.interceptors.request.use(async function (config) {
  // Excluir la ruta de refresh para evitar un ciclo infinito
  if (config.url.includes("/API/refresh")) {
    return config; // Retorna la configuración sin modificar
  }
  const token = AuthStateHelper.getAccessToken();
  const expirationTime = AuthStateHelper.getExpiryTime();

  const currentTime = Date.now();
  const timeRemaining = expirationTime - currentTime;
  if (timeRemaining < 60000 || timeRemaining < 0) {
    // Menos de un minuto para expirar
    try {
      console.log(
        "detecto que queda menos de un minuto, hace solicitud para refrescar token"
      );
      await refreshToken(); // Refresca el token
    } catch (error) {
      console.error("Error al refrescar el token:", error);
      throw error; // Puedes manejar el error según tu lógica
    }
  }

  const newToken = AuthStateHelper.getAccessToken();
  if (newToken) {
    config.headers.Authorization = `Bearer ${newToken}`;
  }
  return config;
});

async function refreshToken() {
  try {
    console.log("entra a la funcion");
    const refreshToken = AuthStateHelper.getRefreshToken();
    const response = await axios.post("http://localhost:4000/API/refresh", {
      refreshToken,
    });
    console.log("Asi es el response.data", response.data);

    const { accessToken } = response.data;
    if (accessToken) {
      AuthStateHelper.setAuth({ ...AuthStateHelper.getAuth(), accessToken });
      console.log("Token renovado correctamente");
    } else {
      console.log("backend no nos dio un nuevo acces token");
      throw new Error("Error al renovar el token");
    }
  } catch (error) {
    console.error("No se pudo renovar el token", error);

    // Opcional: redirige al usuario a la página de inicio de sesión si no es posible renovar el token
    AuthStateHelper.deleteAuth();
    navigateTo("/login");
  }
}
