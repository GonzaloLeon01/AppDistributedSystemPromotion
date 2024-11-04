/* import axios from "axios"; */

const API_URL = "http://localhost:4000/API/checkpoints"; // Cambia esto por la URL de tu API

export default class CheckpointsAPIHelper {
  //API/checkpoints/
  static async getCheckpoints() {
    const response = await axios.get(API_URL);
    return response.data; // devuelve la lista de puntos de control
  }

  //API/checkpoints/
  static async addCheckpoint(checkpointData) {
    const response = await axios.post(API_URL, JSON.stringify(checkpointData));
    return response.data; // devuelve el punto de control creado
  }

  //API/checkpoints/:id
  static async updateCheckpoint(id, checkpointData) {
    const response = await axios.patch(`${API_URL}/${id}`, JSON.stringify(checkpointData));
    return response.data; // devuelve el punto de control actualizado
  }

  //API/checkpoints/:id
  static async deleteCheckpoint(id) {
    
    await axios.delete(`${API_URL}/${id}`);
  }
}
