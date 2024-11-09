const http = require("http");
const url = require("url");
const cors = require("cors");
const { verifyToken } = require("./middleware/authMiddleware");
const animalController = require("./controllers/animalController");
const checkpointController = require("./controllers/checkpointController");
const userController = require("./controllers/userController");
const mqttController = require("./controllers/mqttController");
const fs = require('fs');
const path = require('path');
const PORT = 4000; // Asegúrate que este es el puerto correcto

// Configuración de CORS
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500", // Agregado tu origen
    "http://127.0.0.1:5500", // Alternativa común
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Función para manejar CORS
function handleCors(req, res, callback) {
  // Obtener el origen de la solicitud
  const origin = req.headers.origin;
//res.setHeader('Access-Control-Allow-Origin', '*');

  // Verificar si el origen está en la lista de permitidos
  if (corsOptions.origin.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // Si el origen no está en la lista, podrías:
    // 1. Permitir todos los orígenes (no recomendado para producción)
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // 2. O denegar la solicitud
    res.writeHead(403);
    res.end("Origen no permitido");
    return;
  }

  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(","));
  res.setHeader(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(",")
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Manejar solicitudes OPTIONS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Continuar con la solicitud normal
  callback();
}

const server = http.createServer(async (req, res) => {
  handleCors(req, res, async () => {
    const parsedUrl = url.parse(req.url, true);
    const ruta = parsedUrl.pathname;
    const method = req.method;
    console.log(`Datos: ${parsedUrl} ${ruta} ${method}`);
    // Rutas públicas

    if (ruta === "/API/login" && method === "POST") {
      await userController.login(req, res);
      return;
    }

    if (ruta === "/API/refresh" && method === "POST") {
      await userController.refresh(req, res);
      return;
    }

    if (!verifyToken(req, res)) {
      return;
    }

    // Rutas protegidas
    switch (true) {
      case ruta === "/API/animals" && method === "GET":
        await animalController.getAnimals(req, res);
        break;
      case ruta === "/API/animals" && method === "POST":
        await animalController.createAnimal(req, res);
        break;
      case ruta.match(/^\/API\/animals\/[^/]+$/) && method === "DELETE":
        const animalId = ruta.split("/").pop();
        await animalController.deleteAnimal(req, res, animalId);
        break;
      case ruta.match(/^\/API\/animals\/[^/]+$/) && method === "PATCH":
        const updateId = ruta.split("/").pop();
        await animalController.updateAnimal(req, res, updateId);
        break;
      case ruta === "/API/checkpoints" && method === "GET":
        await checkpointController.getCheckpoints(req, res);
        break;
      case ruta === "/API/checkpoints" && method === "POST":
        await checkpointController.createCheckpoint(req, res);
        break;
      case ruta.match(/^\/API\/checkpoints\/[^/]+$/) && method === "DELETE":
        const checkpointId = ruta.split("/").pop();
        await checkpointController.deleteCheckpoint(req, res, checkpointId);
        break;
      case ruta.match(/^\/API\/checkpoints\/[^/]+$/) && method === "PATCH":
        const checkUpdateId = ruta.split("/").pop();
        await checkpointController.updateCheckpoint(req, res, checkUpdateId);
        break;
      case ruta === "/API/animals/position" && method === "GET":
        await position(res);
        break;
      case ruta === "/API/availableDevices" && method === "GET":
        mqttController.getAllCheckpoints(res);
        break;
      default:
        res.writeHead(404);
        res.end("Not Found");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en el puerto ${PORT}`);
});

async function position(res) {
  let temporalcheck;
  let temporalArray = [];
  const animalData = await animalController.getAnimalsData();
  const checkData = await checkpointController.getCheckpointsData();
  const allChecks = mqttController.getAnimalsInAllCheckpoint(res);
  allChecks.forEach((element) => {
    const index = checkData.findIndex((c) => c.id === element.checkpoint);
    if (index != -1) {
      temporalcheck = {
        id: checkData[index].id,
        lat: checkData[index].lat,
        long: checkData[index].long,
        description: checkData[index].description || "",
        animals: [],
      };
      element.animals.forEach((animal) => {
        const index2 = animalData.findIndex((c) => c.id === animal);
        if (index2 != -1) {
          temporalcheck.animals.push(animalData[index2]);
        }
      });
      temporalArray.push(temporalcheck);
    }
  });
  try {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(temporalArray));
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Error al procesar el JSON" }));
  }
}

module.exports = server;
