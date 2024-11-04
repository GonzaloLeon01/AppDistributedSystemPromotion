/* Página principal que muestra la lista de animales y puntos de control */

import AnimalItem from "../components/AnimalItem.js"; // Componente para renderizar un animal
import CheckpointItem from "../components/CheckpointItem.js"; // Componente para renderizar un punto de control
import AnimalsAPIHelper from "../helper/api/AnimalsAPIHelper.js"; // Helper para la API de animales
import CheckpointsAPIHelper from "../helper/api/CheckpointsAPIHelper.js"; // Helper para la API de checkpoints
import AnimalsStateHelper from "../helper/state/AnimalsStateHelper.js"; // Helper para el estado de los animales
import CheckpointsStateHelper from "../helper/state/CheckpointsStateHelper.js"; // Helper para el estado de los checkpoints

export default class HomePage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadData(); // Carga los datos de animales y checkpoints
  }

  async loadData() {
    try {
      const animalsData = await AnimalsAPIHelper.getAnimals(); // Obtiene los animales
      AnimalsStateHelper.setAnimals(animalsData.data.animals); // Almacena los animales en el estado
      const checkpointsData = await CheckpointsAPIHelper.getCheckpoints(); // Obtiene los puntos de control
      CheckpointsStateHelper.setCheckpoints(checkpointsData.data.checkpoints); // Almacena los checkpoints en el estado
      this.render(); // Renderiza la página
    } catch (error) {
      console.error("Error al cargar los datos:", error); // Manejo de errores
    }
  }

  render() {
    const animals = AnimalsStateHelper.getAnimals(); // Obtiene los animales del estado
    const checkpoints = CheckpointsStateHelper.getCheckpoints(); // Obtiene los checkpoints del estado

    /*  const animals = [
      {
        id: "BT-0012345678",
        name: "Bessie",
        description: "Una vaca lechera holandesa con buen temperamento.",
      },
      {
        id: "BT-0098765432",
        name: "Bella",
        description: "Vaca Jersey conocida por su alta producción de leche.",
      },
      {
        id: "BT-0021354689",
        name: "Max",
        description: "Un toro Hereford fuerte y robusto.",
      },
      {
        id: "BT-0054891324",
        name: "Luna",
        description: "Ternera Simmental curiosa y juguetona.",
      },
      {
        id: "BT-0045687321",
        name: "Rocky",
        description: "Un buey Angus musculoso y confiable.",
      },
      {
        id: "BT-0076543210",
        name: "Daisy",
        description: "Vaca Charolais amigable con excelente genética.",
      },
    ];

    const checkpoints = [
      {
        id: "chk-1234abcd",
        lat: -34.603722,
        long: -58.381592,
        description: "Punto de control cerca del establo principal.",
      },
      {
        id: "chk-5678efgh",
        lat: -34.610768,
        long: -58.382452,
        description: "Control en el área de pastoreo al norte.",
      },
      {
        id: "chk-9012ijkl",
        lat: -34.608301,
        long: -58.387305,
        description:
          "Punto de control junto al río para el suministro de agua.",
      },
      {
        id: "chk-3456mnop",
        lat: -34.605102,
        long: -58.385201,
        description: "Punto de observación en la colina este.",
      },
      {
        id: "chk-7890qrst",
        lat: -34.60405,
        long: -58.3881,
        description: "Punto de control en el área de descanso al sur.",
      },
      {
        id: "chk-1122uvwx",
        lat: -34.6075,
        long: -58.389,
        description: "Punto de control para monitoreo de animales jóvenes.",
      },
    ]; */

    let animalsHtml = `
      <h3 class="home-section-title">Animales</h3>
      <div class="home-animal-list">`;

    // Renderiza cada animal usando el componente AnimalItem
    animals.forEach((animal) => {
      animalsHtml += new AnimalItem(animal).render();
    });

    animalsHtml += "</div>";

    let checkpointsHtml = `
      <h3 class="home-section-title">Puntos de Control</h3>
      <div class="home-checkpoint-list">`;

    // Renderiza cada punto de control usando el componente CheckpointItem
    checkpoints.forEach((checkpoint) => {
      checkpointsHtml += new CheckpointItem(checkpoint).render();
    });

    checkpointsHtml += "</div>";

    this.container.innerHTML = animalsHtml + checkpointsHtml; // Inserta el HTML en el contenedor
  }
}
