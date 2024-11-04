export const validateAnimalData = ({ name, description }) => {
  if (!name || !description) {
    throw new Error("El nombre y la descripción del animal son obligatorios.");
  }
  if (name.length < 2) {
    throw new Error("El nombre del animal debe tener al menos 2 caracteres.");
  }
};
