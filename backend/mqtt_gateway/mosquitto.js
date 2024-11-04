import mqtt from "mqtt";
import fs from "fs";
import http from "http";
const PORT = 3000;
const INTENSIDAD_UMBRAL = -30;
const options = {
  host:'localhost',
  port: 1885,
  username: 'admin',
  password: 'admin'
};

const mqttClient = mqtt.connect(options);
//const mqttClient = mqtt.connect(process?.env?.MQTT_BROKER_URL);

const topico_checkpoints = "checkpoint";
const archivo_datos = "datos.json";
/**
 * Estructura para almacenar puntos de control
 * Se almacena solo informacion para persistir, es decir datos relevantes del punto de control
 */

const puntosDeControl = new Map();
/**
 * Estructura para almacenar animales
 * Se almacena solo informacion para persistir, es decir datos relevantes de cada animal
 */
const animales = new Map();

/***
 * Seguimiento dinamico es una estructura de datos que almacena de la forma
 * Punto de control1
 *    -Animal1
 *    -Animal2
 *    -Animal3
 *
 * * Punto de control2
 *    -Animal4
 *    -Animal5
 */
const seguimientoDinamico = new Map();

// Carga los datos al inicio
cargarDatos();

const serverHttp = http.createServer((req, res) => {
  //Con http
  if (req.method === "GET" && req.url === "/checkpoints") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(seguimientoDinamico));
    return;
  }
  if (req.method === "POST") {
    if (req.url === "/checkpoints") {
      let body = "";
      // Escuchar los datos entrantes en el cuerpo de la solicitud
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body); // Convertir el JSON a un objeto
          // Aquí puedes manipular o agregar datos a `seguimientoDinamico`
          postCheckpoint(data);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Checkpoint agregado",
              data: seguimientoDinamico,
            })
          );
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "JSON inválido" }));
        }
      });
      return;
    }
    if (req.url === "/animals") {
      let body = "";
      // Escuchar los datos entrantes en el cuerpo de la solicitud
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body); // Convertir el JSON a un objeto
          // Aquí puedes manipular o agregar datos a `seguimientoDinamico`
          postAnimal(data);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Animal agregado",
              data: seguimientoDinamico,
            })
          );
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "JSON inválido" }));
        }
      });
      return;
    }
  }
  if (req.method === "PUT") {
    if (req.url === "/checkpoints") {
      let body = "";
      // Escuchar los datos entrantes en el cuerpo de la solicitud
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body); // Convertir el JSON a un objeto
          // Aquí puedes manipular o agregar datos a `seguimientoDinamico`
          putCheckpoint(data);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Checkpoint modificado",
              data: seguimientoDinamico,
            })
          );
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "JSON inválido" }));
        }
      });
      return;
    }
    if (req.url === "/animals") {
      let body = "";
      // Escuchar los datos entrantes en el cuerpo de la solicitud
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body); // Convertir el JSON a un objeto
          // Aquí puedes manipular o agregar datos a `seguimientoDinamico`
          putAnimal(data);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Animal modificado",
              data: seguimientoDinamico,
            })
          );
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "JSON inválido" }));
        }
      });
      return;
    }
  }
  if (req.method === "DELETE") {
    if (req.url === "/checkpoints") {
      let body = "";
      // Escuchar los datos entrantes en el cuerpo de la solicitud
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body); // Convertir el JSON a un objeto
          // Aquí puedes manipular o agregar datos a `seguimientoDinamico`
          deleteCheckpoint(data);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Checkpoint eliminado",
              data: seguimientoDinamico,
            })
          );
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "JSON inválido" }));
        }
      });
      return;
    }
    if (req.url === "/animals") {
      let body = "";
      // Escuchar los datos entrantes en el cuerpo de la solicitud
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body); // Convertir el JSON a un objeto
          // Aquí puedes manipular o agregar datos a `seguimientoDinamico`
          deleteAnimal(data);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Animal eliminado",
              data: seguimientoDinamico,
            })
          );
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "JSON inválido" }));
        }
      });
      return;
    }
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Flaco, hiciste todo mal ¿Cómo hiciste?");
});

serverHttp.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

/*
Post para agregar puntos de control
Put Para cambiar puntos de control
Delete para eliminar puestos de control
*/

/*
Lo mismo que con puntos de control pero con animales
*/

function postAnimal(request) {
  const macAnimal = request.body?.macAnimal;
  const tipoAnimal = request.body?.tipoAnimal;
  const estado = request.body?.estado;

  //agregar mac
  if (
    macAnimal != undefined &&
    tipoAnimal != undefined &&
    estado != undefined &&
    !(macAnimal in animales)
  ) {
    const animal = {
      macAnimal: macAnimal,
      tipoAnimal: tipoAnimal,
      estado: estado,
    };
    animales.set(macAnimal, animal);
    volcarADisco()
      .then(() => {
        res.send(200);
      })
      .catch((error) => {
        res.writeHead(400, "Error al almacenar el valor modificado");
      });
    return;
  } else {
    //Faltan datos o el animal ya esta en la BD
    res.writeHead(
      400,
      "Error, el animal ya se encuentra en la BD o faltan datos"
    );
    res.end();
    return;
  }
  datos_almacenadosJSON = JSON.stringify(datos_almacenados);
}

function putAnimal(request) {
  const macAnimal = request.body?.macAnimal;
  const tipoAnimal = request.body?.tipoAnimal;
  const estado = request.body?.estado;
  if (
    macAnimal != undefined &&
    tipoAnimal != undefined &&
    estado != undefined &&
    macAnimal != undefined &&
    macAnimal in animales
  ) {
    const animal = {
      macAnimal: macAnimal,
      tipoAnimal: tipoAnimal,
      estado: estado,
    };
    animales.set(macAnimal, animal);
    volcarADisco()
      .then(() => {
        res.send(200);
      })
      .catch((error) => {
        res.writeHead(400, "Error al almacenar el valor modificado");
      });
  } else {
    res.writeHead(
      400,
      "Error,el animal no se encuentra en la BD o faltan datos"
    );
    res.end();
  }
}

function deleteAnimal(request) {
  const macAnimal = request.body?.macAnimal;
  if (macAnimal != undefined && macAnimal in animales) {
    animales.delete(macAnimal);
    volcarADisco()
      .then(() => {
        res.send(200);
      })
      .catch((error) => {
        res.writeHead(400, "Error al almacenar el valor modificado");
      });
    return;
  } else {
    res.writeHead(
      400,
      "Error,el animal no se encuentra en la BD o faltan datos"
    );
    res.end();
  }
}

function postCheckpoint(request) {
  const macCheckpoint = request.body?.macCheckpoint;
  const nombreCheckpoint = request.body?.nombreCheckpoint;
  const estado = request.body?.estado;
  if (
    macCheckpoint != undefined &&
    nombreCheckpoint != undefined &&
    estado != undefined &&
    macCheckpoint != undefined &&
    !(macCheckpoint in puntosDeControl)
  ) {
    const animal = {
      macCheckpoint: macCheckpoint,
      nombreCheckpoint: nombreCheckpoint,
    };
    puntosDeControl.set(macCheckpoint, animal);
    volcarADisco()
      .then(() => {
        return 200, "Exito";
      })
      .catch((error) => {
        return 400, "Error al almacenar el valor modificado";
      });
    return;
  } else {
    return 400, "Error, el checkpoint ya se encuentra en la BD o faltan datos";
  }
}

function putCheckpoint(request) {
  const macCheckpoint = request.body?.macCheckpoint;
  const nombreCheckpoint = request.body?.nombreCheckpoint;
  const estado = request.body?.estado;
  if (
    macCheckpoint != undefined &&
    nombreCheckpoint != undefined &&
    estado != undefined &&
    macCheckpoint != undefined &&
    macCheckpoint in puntosDeControl
  ) {
    const checkpoint = {
      macCheckpoint: macCheckpoint,
      nombreCheckpoint: nombreCheckpoint,
    };
    puntosDeControl.set(macCheckpoint, checkpoint);
    volcarADisco()
      .then(() => {
        res.send(200);
      })
      .catch((error) => {
        res.writeHead(400, "Error al almacenar el valor modificado");
      });
    return;
  } else {
    res.writeHead(
      400,
      "Error, el checkpoint no se encuentra en la BD o faltan datos"
    );
    res.end();
  }
}

function deleteCheckpoint(request) {
  const macCheckpoint = request.body?.macCheckpoint;
  if (macCheckpoint != undefined && macCheckpoint in puntosDeControl) {
    puntosDeControl.delete(macCheckpoint);
    volcarADisco()
      .then(() => {
        res.send(200);
      })
      .catch((error) => {
        res.writeHead(400, "Error al almacenar el valor modificado");
      });
    return;
  } else {
    res.writeHead(
      400,
      "Error,el checkpoint no se encuentra en la BD o faltan datos"
    );
    res.end();
  }
}

//------------
mqttClient.on("connect", () => {
  mqttClient.subscribe(topico_checkpoints, (err) => {
    if (err) {
      console.error(err);
    }
  });
});
// Llamada en el bloque de verificación MQTT
mqttClient.on("message", (topic, message) => {
  if (topic === topico_checkpoints) {
    console.log(message);
    console.log(message.toString());
  }
  /* try {
      const data = JSON.parse(message.toString());

      if (
        typeof data?.controlPointMAC != undefined &&
        typeof data?.devices != undefined
      ) {
        console.log("Mensaje recibido y verificado:", data);

        // Guardar la ubicación del animal
        guardarDatosAnimal(data.controlPointMAC, data.devices);
      } else {
        console.error("Formato inválido en el mensaje MQTT recibido:", data);
      }
    } catch (err) {
      console.error("Error al procesar el mensaje MQTT:", err.message);
    }
  }
  //mqttClient.end(); para que sirve?
  */
});

mqttClient.on("error", (err) => {
  console.error("Connection error:", err);
});

function guardarDatosAnimal(checkpointMAC, animalesCheckpointRAW) {
  animalesValidos = [];
  animalesCheckpointRAW.forEach((animalCheckpoint) => {
    if (animalCheckpoint.intensidad_señal >= INTENSIDAD_UMBRAL) {
      // verifico intensidad
      if (
        animalCheckpoint.mac in animales &&
        animales[animalCheckpoint.mac].estado == "activo"
      )
        //Luego si pertenece
        animalesValidos.push(animales[mac]);
    }
  });

  if (
    checkpointMAC in puntosDeControl &&
    puntosDeControl[checkpointMAC].estado == "activo"
  ) {
    seguimientoDinamico.set(checkpointMAC, animalesValidos);
  }
}

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

// Cargar los datos desde JSON
function cargarDatos() {
  if (fs.existsSync(archivo_datos)) {
    const datosCargados = JSON.parse(fs.readFileSync(archivo_datos));

    datosCargados.puntosDeControl.forEach(([key, value]) => {
      puntosDeControl.set(key, value);
    });

    datosCargados.animales.forEach(([key, value]) => {
      animales.set(key, value);
    });
  }
}
