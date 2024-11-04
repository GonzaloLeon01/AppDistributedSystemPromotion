import fs from "fs";

const archivo_datos = "datos.json";

function volcarADisco() {
  return new Promise((resolve, reject) => {
    const datosParaGuardar = {
      puntosDeControl: Array.from(puntosDeControl.entries()),
      animales: Array.from(animales.entries()),
    };
    fs.writeFile(archivo_datos, JSON.stringify(datosParaGuardar), (error) => {
      if (error) {
        reject(error); // Rechaza la promesa en caso de error
      } else {
        resolve(); // Resuelve la promesa si todo va bien
      }
    });
  });
}
const puntosDeControl = new Map();
const animales = new Map();

const puntoDeControl1 = {
  nombre: "SUR",
  latitud: 12,
  longitud: 20,
  macCheckpoint: "FFFFFF",
};

const puntoDeControl2 = {
  nombre: "Norte",
  latitud: 19,
  longitud: 30,
  macCheckpoint: "11111111",
};

const animal = {
  macAnimal: "FFFFFFFFFF",
  nombre: "vacaLola",
  tipo: "vaca",
  estado: "activo",
};

puntosDeControl.set("FFFFFF", puntoDeControl1);
puntosDeControl.set("11111111", puntoDeControl2);
animales.set("FFFFFFFFFF", animal);

volcarADisco()
  .then(() => {
    console.log("excelente");
  })
  .catch((error) => {
    console.log("error");
  });
