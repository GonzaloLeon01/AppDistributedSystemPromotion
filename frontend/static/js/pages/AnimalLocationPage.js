/* Página para visualizar la ubicación de los animales */

import AnimalsAPIHelper from "../helper/api/AnimalsAPIHelper.js";

export default class AnimalLocationPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadAnimalLocations();
  }

  async loadAnimalLocations() {
    try {
      const data = await AnimalsAPIHelper.getAnimalsPosition();
      /* Mock data para la respuesta de animals/position
      const data = [
        {
          id: "pos-001",
          lat: -34.603722,
          long: -58.381592,
          description: "Establo Principal",
          animals: ["Bovino-01", "Bovino-02", "Bovino-03"],
        },
        {
          id: "pos-002",
          lat: -34.610768,
          long: -58.382452,
          description: "Campo de Pastoreo Norte",
          animals: ["Bovino-04", "Bovino-05"],
        },
        {
          id: "pos-003",
          lat: -34.608301,
          long: -58.387305,
          description: "Río Este",
          animals: ["Bovino-06", "Bovino-07"],
        },
        {
          id: "pos-004",
          lat: -34.60405,
          long: -58.3881,
          description: "Descanso Sur",
          animals: ["Bovino-08"],
        },
        {
          id: "pos-005",
          lat: -34.6075,
          long: -58.389,
          description: "Corral de Animales Jóvenes",
          animals: ["Bovino-09", "Bovino-10"],
        },
      ]; */

      this.animalLocations = data;
    } catch (error) {
      console.error("Error loading animal locations:", error);
      this.animalLocations = [];
    } finally {
      this.render();
    }
  }

  render() {
    const locationHtml = `
      <h2 class="animal-location-title">Ubicaciones de Animales</h2>
      <div class="animal-location-list">
        ${this.animalLocations
          .map((location) => this.renderLocationItem(location))
          .join("")}
      </div>
    `;
    this.container.innerHTML = locationHtml;
  }

  renderLocationItem(location) {
    return `
      <div class="animal-location-item">
        <h3>${location.id}</h3>
        <p><strong>Descripción:</strong> ${location.description}</p>
        <p><strong>Latitud:</strong> ${location.lat}</p>
        <p><strong>Longitud:</strong> ${location.long}</p>
        ${
          location.animals && location.animals.length > 0
            ? `<p><strong>Animales asociados:</strong> ${location.animals.join(
                ", "
              )}</p>`
            : ""
        }
      </div>
    `;
  }
}
