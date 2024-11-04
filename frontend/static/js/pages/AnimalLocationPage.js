/* Página para visualizar la ubicación de los animales */

import AnimalsAPIHelper from "../helper/api/AnimalsAPIHelper.js";

export default class AnimalLocationPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadAnimalLocations();
  }

  async loadAnimalLocations() {
    try {
      //const data = await AnimalsAPIHelper.getAnimalsPosition();
      // Mock data para la respuesta de animals/position
      const data = [
        {
          id: "pos-001",
          lat: -38.0023, // Centro de Mar del Plata
          long: -57.5579,
          description: "Centro de Mar del Plata",
          animals: ["Bovino-01", "Bovino-02"],
        },
        {
          id: "pos-002",
          lat: -38.0255, // Playa Grande
          long: -57.5583,
          description: "Playa Grande",
          animals: ["Bovino-03", "Bovino-04"],
        },
        {
          id: "pos-003",
          lat: -38.0155, // Parque Camet
          long: -57.515,
          description: "Parque Camet",
          animals: ["Bovino-05", "Bovino-06"],
        },
        {
          id: "pos-004",
          lat: -38.0085, // Estadio José María Minella
          long: -57.5525,
          description: "Estadio José María Minella",
          animals: ["Bovino-07"],
        },
        {
          id: "pos-005",
          lat: -37.9867, // Reserva Natural Otamendi
          long: -57.535,
          description: "Reserva Natural Otamendi",
          animals: ["Bovino-08", "Bovino-09"],
        },
      ];

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
      <h2 class="animal-location-title">Mapa de Animales</h2>
      <div id="map" style="height: 400px; width: 100%;"></div> <!-- Div del mapa -->
      <h2 class="animal-location-title">Ubicaciones de Animales</h2>
      <div class="animal-location-list" id="animal-location-list"></div> <!-- Contenedor para la lista -->
    `;
    this.container.innerHTML = locationHtml; // Agrega el mapa y la lista al contenedor
    this.initMap(); // Inicializa el mapa después de agregarlo al DOM
    this.renderLocations(); // Renderiza la lista de ubicaciones
  }

  initMap() {
    // Inicializa el mapa en la ubicación de Mar del Plata
    const map = L.map("map").setView([-38.00120839, -57.5812635], 12);
    // Añade el tile layer de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Agrega los marcadores de cada checkpoint con la información de los animales
    this.animalLocations.forEach((location) => {
      const marker = L.marker([location.lat, location.long]).addTo(map);
      marker.bindPopup(`
        <h3>${location.description}</h3>
        <p><strong>Checkpoint ID:</strong> ${location.id}</p>
        <p><strong>Animales asociados:</strong> ${location.animals.join(
          ", "
        )}</p>
      `);
    });
  }

  renderLocations() {
    const locationHtml = this.animalLocations
      .map((location) => this.renderLocationItem(location))
      .join("");

    const locationList = document.getElementById("animal-location-list");
    locationList.innerHTML = locationHtml; // Agregar la lista de ubicaciones al contenedor correspondiente
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
