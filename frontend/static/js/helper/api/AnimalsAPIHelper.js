const API_URL = "http://localhost:4000/API/animals";

export default class AnimalsAPIHelper {
  //API/animals/
  static async getAnimals() {
    const response = await axios.get(API_URL);
    //return response.data.animals; // devuelve la lista de animales
    return response.data;
  }

  //API/animals/
  static async addAnimal(animalData) {
    const response = await axios.post(API_URL, animalData);
    return response.data; // devuelve el animal creado
  }

  //API/animals/:id
  static async updateAnimal(id, animalData) {
    const response = await axios.patch(
      `${API_URL}/${id}`,
      JSON.stringify(animalData)
    );
    return response.data; // devuelve el animal actualizado
  }

  //API/animals/:id
  static async deleteAnimal(id) {
    await axios.delete(`${API_URL}/${id}`);
  }

  //API/animals/position/
  static async getAnimalsPosition() {
    const response = await axios.get(`${API_URL}/position`);
    return response.data; // devuelve la lista de posiciones de animales
  }

  // API/availableDevices/
  static async getAvailableDevices() {
    const response = await axios.get("/API/availableDevices");
    return response.data.devices; // devuelve la lista de dispositivos
  }
}
