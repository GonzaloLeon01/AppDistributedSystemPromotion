export default class AnimalItem {
  constructor({ id, name, description }) {
    this.id = id; //BT COLLAR
    this.name = name;
    this.description = description;
  }

  render() {
    return `
      <div class="animal-item">
        <h4>${this.name}</h4>
        <p>${this.description}</p>
        <button id="edit-${this.id}">Editar</button>
        <button id="delete-${this.id}">Eliminar</button>
      </div>
    `;
  }
}
