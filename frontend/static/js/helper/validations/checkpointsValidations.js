export function validateCheckpointData(checkpoint) {
  if (!checkpoint.id || !checkpoint.lat || !checkpoint.long)
    throw new Error("ID, latitud y longitud son obligatorios.");
  if (isNaN(parseFloat(checkpoint.lat)) || isNaN(parseFloat(checkpoint.long))) {
    throw new Error("Latitud y longitud deben ser números.");
  }
}
//Agregar mas validaciones?
