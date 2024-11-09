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
      //console.log(data);

      // Mock data para la respuesta de animals/position
      const data = [
        {
          id: "pos-001",
          lat: -34.603722,
          long: -58.381592,
          description: "Establo Principal",
          animals: [
            {
              id: "11:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            // Más objetos de animales con la misma estructura pueden seguir aquí
          ],
        },
        {
          id: "pos-002",
          lat: -34.610768,
          long: -58.382452,
          description: "Campo de Pastoreo Norte",
          animals: [
            {
              id: "11:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            // Más objetos de animales con la misma estructura pueden seguir aquí
          ],
        },
        {
          id: "pos-003",
          lat: -34.608301,
          long: -58.387305,
          description: "Río Este",
          animals: [
            {
              id: "11:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            // Más objetos de animales con la misma estructura pueden seguir aquí
          ],
        },
        {
          id: "pos-004",
          lat: -34.60405,
          long: -58.3881,
          description: "Descanso Sur",
          animals: [
            {
              id: "11:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            {
              id: "112:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto2 Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            // Más objetos de animales con la misma estructura pueden seguir aquí
          ],
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
    let map = null;
    // Obtén todas las coordenadas de las ubicaciones
    const coordinates = this.animalLocations.map((location) => [
      location.lat,
      location.long,
    ]);

    // Inicializa el mapa en la ubicación de Mar del Plata
    if (this.animalLocations.length > 0) {
      // Usa la latitud y longitud del primer elemento en animalLocations
      const initialLat = parseFloat(this.animalLocations[0].lat);
      const initialLong = parseFloat(this.animalLocations[0].long);

      // Inicializa el mapa en la ubicación inicial obtenida de animalLocations
      map = L.map("map").setView([initialLat, initialLong], 12);
      map.fitBounds(coordinates, {
        padding: [30, 30], // Agrega un margen de 50 píxeles a cada lado del mapa
      });
    } else {
      // Fallback si no hay datos en animalLocations
      map = L.map("map").setView([-38.00120839, -57.5812635], 12);
    }
    //const map = L.map("map").setView([-38.00120839, -57.5812635], 12);

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
        ${
          location.animals && location.animals.length > 0
            ? `
              <p><strong>Animales asociados:</strong></p>
              <ul>
                ${location.animals
                  .map(
                    (animal) => `
                      <li>
                        <p><strong>ID:</strong> ${animal.id}</p>
                        <p><strong>Nombre:</strong> ${animal.name}</p>
                        <p><strong>Descripción:</strong> ${animal.description}</p>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            `
            : "<p><strong>Animales asociados:</strong> No hay animales asociados</p>"
        }
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
            ? `
              <p><strong>Animales asociados:</strong></p>
              <ul>
                ${location.animals
                  .map(
                    (animal) => `
                      <li>
                        <p><strong>MAC:</strong> ${animal.id}</p>
                        <p><strong>Nombre:</strong> ${animal.name}</p>
                        <p><strong>Descripción:</strong> ${animal.description}</p>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            `
            : "<p><strong>Animales asociados:</strong> No hay animales asociados</p>"
        }
      </div>
    `;
  }
}
