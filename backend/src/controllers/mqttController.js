const mqtt = require("mqtt");
const options = {
  host: "localhost",
  port: 1883,
  username: "api",
  password: "api",
};
const client = mqtt.connect(options);

// Estructura para almacenar los datos de los checkpoints y animales
const animalTracker = new Map(); // Almacena la ultima ubicacion de cada animal
const checkpointData = new Map(); // Almacena los datos de cada checkpoint

const topic = "checkpoints";
let isConnected = false;

client.on("connect", () => {
  console.log("Conectado al broker MQTT");
  isConnected = true;

  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Suscrito al topic: ${topic}`);
    } else {
      console.error("Error al suscribirse:", err);
    }
  });
});

client.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    if (!data.checkpointID || !Array.isArray(data.animals)) {
      throw new Error("Formato de mensaje inválido");
    }

    console.log("Checkpoint ID:", data.checkpointID);
    console.log("Animales detectados:", data.animals.length);

    if (!checkpointData.has(data.checkpointID)) {
      checkpointData.set(data.checkpointID, {
        animals: new Map(),
      });
    }

    data.animals.forEach((animal) => {
      if (!animal.id || typeof animal.rssi !== "number") {
        console.warn("Animal con formato invalido:", animal);
        return;
      }

      const tempSignal = {
        checkpointId: data.checkpointID,
        rssi: animal.rssi,
      };

      const currentAnimalData = animalTracker.get(animal.id);
      const currentCheckpoint = currentAnimalData?.currentCheckpoint;

      let bestCheckpoint = findBestCheckpoint(animal.id, tempSignal);

      if (bestCheckpoint === data.checkpointID) {
        if (currentCheckpoint && checkpointData.has(currentCheckpoint)) {
          checkpointData.get(currentCheckpoint).animals.delete(animal.id);
        }

        checkpointData.get(data.checkpointID).animals.set(animal.id, {
          rssi: animal.rssi,
        });

        animalTracker.set(animal.id, {
          currentCheckpoint: bestCheckpoint,
          signalStrength: animal.rssi,
          lastUpdate: new Date(),
        });

        console.log(`Animal ID: ${animal.id}`);
        console.log(`Checkpoint anterior: ${currentCheckpoint}`);
        console.log(`Nuevo mejor checkpoint: ${bestCheckpoint}`);
        console.log(`RSSI: ${animal.rssi}dBm`);
      }
    });
  } catch (error) {
    console.error("Error al procesar el mensaje:", error.message);
  }
});

function findBestCheckpoint(animalId, tempSignal) {
  let bestRSSI = -Infinity;
  let bestCheckpoint = null;

  checkpointData.forEach((data, checkpointId) => {
    if (checkpointId === tempSignal.checkpointId) {
      if (tempSignal.rssi > bestRSSI) {
        bestRSSI = tempSignal.rssi;
        bestCheckpoint = checkpointId;
      }
    } else {
      const animalData = data.animals.get(animalId);
      if (animalData && animalData.rssi > bestRSSI) {
        bestRSSI = animalData.rssi;
        bestCheckpoint = checkpointId;
      }
    }
  });
  return bestCheckpoint;
}

function getAnimalLocation(animalId) {
  return animalTracker.get(animalId);
}

function getAnimalsInCheckpoint(checkpointId) {
  const animals = [];
  animalTracker.forEach((data, animalId) => {
    if (data.currentCheckpoint === checkpointId) {
      animals.push({
        id: animalId,
        signalStrength: data.signalStrength,
        lastUpdate: data.lastUpdate,
      });
    }
  });
  return animals;
}

function getAnimalsInAllCheckpoint() {
  const checkpointsArray = Array.from(
    checkpointData,
    ([checkpointId, checkpointValue]) => {
      const animalsArray = Array.from(
        checkpointValue.animals,
        ([animalId]) => animalId
      );
      return {
        checkpoint: checkpointId,
        animals: animalsArray,
      };
    }
  );

  return checkpointsArray;
}

function getAllCheckpoints(res) {
  try {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(Array.from(checkpointData.keys())));
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Error al procesar el JSON" }));
  }
}

client.on("error", (error) => {
  console.error("Error de conexión MQTT:", error);
  isConnected = false;
});

client.on("close", () => {
  console.log("Desconectado del broker MQTT");
  isConnected = false;
});

module.exports = {
  getAllCheckpoints,
  getAnimalLocation,
  getAnimalsInCheckpoint,
  getAnimalsInAllCheckpoint,
  animalTracker,
  checkpointData,
};
