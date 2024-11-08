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

const topico_checkpoints = "checkpoint";
let isConnected = false;

client.on("connect", () => {
  console.log("Conectado al broker MQTT");
  isConnected = true;

  client.subscribe(topico_checkpoints, (err) => {
    if (!err) {
      console.log(`Suscrito al topic: ${topico_checkpoints}`);
    } else {
      console.error("Error al suscribirse:", err);
    }
  });
});
// Estructura para almacenar fragmentos pendientes
const fragmentBuffer = new Map();

client.on("message", (topic, message) => {
  if (topic === topico_checkpoints) {
    try {
      const data = JSON.parse(message.toString());

      // Verifica si el mensaje contiene fragmentos
      const { packageNum, totalPackages, deviceMac, devices } = data;

      if (packageNum !== undefined && totalPackages !== undefined) {
        if (!fragmentBuffer.has(deviceMac)) {
          //Si no existe un registro de esa MAC
          fragmentBuffer.set(deviceMac, []);
        } else if (packageNum == 1) {
          fragmentBuffer.set(deviceMac, []); //Si existe un registro(incompleto) de la mac pero llego un paquete nuevo.
        }

        // Almacena el fragmento en la posición correcta
        fragmentBuffer.get(deviceMac)[packageNum] = devices;

        // Comprueba si todos los fragmentos han sido recibidos
        /*const receivedFragments = fragmentBuffer
          .get(deviceMac)
          .filter(Boolean).length;--- Lo q hizo chatgpt pero no tiene mucho sentido si
           los paquetes se envian secuencialmente, ademas capaz alguno se pierde y queda
           el mapa con datos viejos y se hace un desaste mezclando cosas viejas y nuevas*/
        if (packageNum === totalPackages) {
          // Combina todos los fragmentos
          const fullDevices = fragmentBuffer.get(deviceMac).flat();
          fragmentBuffer.delete(deviceMac);

          // Procesa el mensaje completo como de costumbre
          processMessage(deviceMac, fullDevices);
        }
      } else {
        // Procesa el mensaje si no está fragmentado
        processMessage(deviceMac, devices);
      }
    } catch (error) {
      console.error("Error al procesar el mensaje:", error.message);
    }
  }
});

// Función para procesar el mensaje completo
function processMessage(deviceMac, devices) {
  console.log("Checkpoint ID:", deviceMac);
  console.log("Animales detectados:", devices.length);

  if (!checkpointData.has(deviceMac)) {
    checkpointData.set(deviceMac, {
      animals: new Map(),
    });
  }

  devices.forEach((animal) => {
    if (!animal.id || typeof animal.rssi !== "number") {
      console.warn("Animal con formato invalido:", animal);
      return;
    }

    const tempSignal = {
      checkpointId: deviceMac,
      rssi: animal.rssi,
    };

    const currentAnimalData = animalTracker.get(animal.id);
    const currentCheckpoint = currentAnimalData?.currentCheckpoint;

    let bestCheckpoint = findBestCheckpoint(animal.id, tempSignal);

    if (bestCheckpoint === deviceMac) {
      if (currentCheckpoint && checkpointData.has(currentCheckpoint)) {
        checkpointData.get(currentCheckpoint).animals.delete(animal.id);
      }

      checkpointData.get(deviceMac).animals.set(animal.id, {
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
}

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
    const allKeys = Array.from(checkpointData.values()).flatMap((value) => {
      if (value.animals instanceof Map) {
        return Array.from(value.animals.keys());
      }
      return [];
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(allKeys));
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
