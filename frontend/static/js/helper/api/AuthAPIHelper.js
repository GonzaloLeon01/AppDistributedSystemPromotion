//import { API_ROUTES } from '../../constants/constants.js';
const API_URL = "http://localhost:4000/API/login";
export default class AuthAPIHelper {
  static async login({ username, password }) {
    const response = await axios.post(API_URL, { username, password });
    return response.data;
  }
}
