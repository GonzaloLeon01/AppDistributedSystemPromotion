/*  Página para gestionar puntos de control, incluyendo añadir, editar y eliminar checkpoints. */
import CheckpointItem from "../components/CheckpointItem.js";
import CheckpointsAPIHelper from "../helper/api/CheckpointsAPIHelper.js";

export default class CheckpointManagementPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadCheckpoints();
  }

  async loadCheckpoints() {
    try {
      const data = await CheckpointsAPIHelper.getCheckpoints();
      /* const data = [
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
      this.checkpoints = data;
    } catch (error) {
      console.error("Error loading checkpoints:", error);
      this.checkpoints = [];
    } finally {
      this.render();
      this.addListeners();
    }
  }

  async handleAddCheckpoint(event) {
    event.preventDefault();
    const id = event.target.elements.uid.value.trim();
    const lat = parseFloat(event.target.elements.lat.value);
    const long = parseFloat(event.target.elements.long.value);
    const description = event.target.elements.description.value.trim();

    try {
      await CheckpointsAPIHelper.addCheckpoint({ id, lat, long, description });
      //this.checkpoints.push({ lat, long, description });
      alert("Punto de control agregado exitosamente");
      this.loadCheckpoints(); // esto si va
      /*       this.render(); // esto no va
      this.addListeners(); // esto no va, es lo que hace que tire error */
    } catch (error) {
      console.error("Error adding checkpoint:", error);
      alert("Error agregando punto de control");
    }
  }

  async handleEditCheckpoint(id, lat, long, description) {
    const newLat = parseFloat(prompt("Nueva latitud:", lat));
    const newLong = parseFloat(prompt("Nueva longitud:", long));
    const newDescription = prompt("Nueva descripción:", description);

    try {
      await CheckpointsAPIHelper.updateCheckpoint(id, {
        id: id, //ilegal?
        lat: newLat,
        long: newLong,
        description: newDescription,
      });
      /*       const index = this.checkpoints.findIndex((check) => check.id === id);
      if (index !== -1) {
        this.checkpoints[index].lat = newLat;
        this.checkpoints[index].long = newLong;
        this.checkpoints[index].description = newDescription;
      }
      console.log(index); */
      alert("Punto de control actualizado exitosamente");
      this.loadCheckpoints(); // Recarga los checkpoints
      /*       this.render();
      this.addListeners(); */
    } catch (error) {
      console.error("Error updating checkpoint:", error);
      alert("Error actualizando punto de control");
    }
  }

  async handleDeleteCheckpoint(id) {
    if (
      confirm("¿Estás seguro de que deseas eliminar este punto de control?")
    ) {
      try {
        console.log(id);
        await CheckpointsAPIHelper.deleteCheckpoint(id);
        alert("Punto de control eliminado exitosamente");
        this.loadCheckpoints(); // Recarga los checkpoints
        /*         this.checkpoints = this.checkpoints.filter((chek) => chek.id != id);
        alert("Punto de control eliminado con éxito");
        this.render();
        this.addListeners(); */
      } catch (error) {
        console.error("Error deleting checkpoint:", error);
        alert("Error eliminando punto de control");
      }
    }
  }

  render() {
    const checkpointsHtml = `
      <h2 class="checkpoint-management-title">Gestión de Puntos de Control</h2>
      <form id="checkpoint-form" class="checkpoint-form-container">
        <h3 class="checkpoint-form-title">Agregar Nuevo Punto de Control</h3>
        <div class="input-container">
          <label for="uid" class="input-label">MAC:</label>
          <input class="input-field" type="text" id="uid" name="uid" required>
        </div>
        <div class="input-container">
          <label for="lat" class="input-label">Latitud:</label>
          <input class="input-field" type="number" id="lat" name="lat" required>
        </div>
        <div class="input-container">
          <label class="input-label" for="long">Longitud:</label>
          <input class="input-field" type="number" id="long" name="long" required>
        </div>
        <div class="input-container">
          <label for="description" class="input-label">Descripción:</label>
          <input class="input-field" type="text" id="description" name="description" required>
        </div>
        <button type="submit" class="form-submit-button">Agregar Punto de Control</button>
      </form>
      <div class="checkpoint-list">
        <h3 class="checkpoint-list-title"> Lista de Puntos de Control </h3>
        ${this.checkpoints
          .map((checkpoint) => new CheckpointItem(checkpoint).render())
          .join("")}
      </div>
    `;
    this.container.innerHTML = checkpointsHtml;
  }

  addListeners() {
    document
      .getElementById("checkpoint-form")
      .addEventListener("submit", (e) => this.handleAddCheckpoint(e));

    // Agrega listeners para editar y eliminar cada checkpoint
    this.checkpoints.forEach((checkpoint) => {
      document
        .getElementById(`edit-${checkpoint.id}`)
        .addEventListener("click", () =>
          this.handleEditCheckpoint(
            checkpoint.id,
            checkpoint.lat,
            checkpoint.long,
            checkpoint.description
          )
        );
      document
        .getElementById(`delete-${checkpoint.id}`)
        .addEventListener("click", () =>
          this.handleDeleteCheckpoint(checkpoint.id)
        );
    });
  }
}
