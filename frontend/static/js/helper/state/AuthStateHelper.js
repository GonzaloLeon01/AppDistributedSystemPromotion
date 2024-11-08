export default class AuthStateHelper {
  static decodeToken(token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      return payload;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }

  static getAuth() {
    return JSON.parse(localStorage.getItem("auth"));
  }

  static setAuth(auth) {
    const { accessToken } = auth;
    const decodedToken = this.decodeToken(accessToken);
    const expiryTime = decodedToken ? decodedToken.exp * 1000 : Date.now(); // Convertir `exp` de segundos a milisegundos
    const authWithExpiry = { ...auth, expiryTime };
    localStorage.setItem("auth", JSON.stringify(authWithExpiry));
  }

  static getAccessToken() {
    const auth = this.getAuth();
    return auth?.accessToken;
  }

  static getExpiryTime() {
    const auth = this.getAuth();
    return auth?.expiryTime;
  }

  static getRefreshToken() {
    const auth = this.getAuth();
    return auth?.refreshToken;
  }

  static deleteAuth() {
    localStorage.removeItem("auth");
  }

  static isTokenExpired() {
    const accessToken = this.getAccessToken();
    if (!accessToken) return true;

    try {
      const payloadBase64 = accessToken.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const currentTime = Date.now() / 1000; // Convertir a segundos
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return true; // En caso de error, considerar el token como expirado
    }
  }
}
