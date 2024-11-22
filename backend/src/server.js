const express = require('express');
const cors = require('cors');
const { verifyToken } = require('./middleware/authMiddleware');
const AnimalController = require('./controllersExpress/animalController');
const CheckpointController = require('./controllersExpress/checkpointController');
const UserController = require('./controllersExpress/userController');
const mqttController = require('./controllersExpress/mqttController');
require('dotenv').config();

const app = express();

// Instanciar controladores
const animalController = new AnimalController();
const checkpointController = new CheckpointController();
const userController = new UserController();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
// Funcion getPosition como middleware
const getPosition = async (req, res) => {
  try {
    let temporalArray = [];
    const animalData = await animalController.getAnimalsData(req, res);
    const checkData = await checkpointController.getCheckpointsData(req, res);
    const allChecks = await mqttController.getAnimalsInAllCheckpoint(res);
    
    allChecks.forEach((element) => {
      const index = checkData.findIndex((c) => c.id === element.checkpoint);
      if (index !== -1) {
        let temporalcheck = {
          id: checkData[index].id,
          lat: checkData[index].lat,
          long: checkData[index].long,
          description: checkData[index].description || "",
          animals: [],
        };
        
        element.animals.forEach((animal) => {
          const index2 = animalData.findIndex((c) => c.id === animal);
          if (index2 !== -1) {
            temporalcheck.animals.push(animalData[index2]);
          }
        });
        temporalArray.push(temporalcheck);
      }
    });
    
    res.status(200).json(temporalArray);
  } catch (error) {
    console.error('Error in getPosition:', error);
    res.status(400).json({ error: "Error al procesar el JSON" });
  }
};


// Configuración de middlewares de parseo ANTES de cualquier otro middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors(corsOptions));

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  // Verificar la ruta antes de procesar el token
  if (req.path === '/login' || req.path === '/refresh') {
    return next();
  }
  
  // Para debugging - ver el contenido del body
  console.log('Request Body:', req.body);
  console.log('Content-Type:', req.get('Content-Type'));
  
  return verifyToken(req, res, next);
};


// Rutas públicas
app.post('/API/login', (req, res) => userController.login(req, res));
app.post('/API/refresh', (req, res) => userController.refresh(req, res));

// Aplicar el middleware de autenticación después de las rutas públicas
app.use('/API', authMiddleware);

// Rutas de animales
app.get('/API/animals', (req, res) => animalController.getAnimals(req, res));
app.post('/API/animals', (req, res) => animalController.createAnimal(req, res));
app.delete('/API/animals/:id', (req, res) => animalController.deleteAnimal(req, res));
app.patch('/API/animals/:id', (req, res) => animalController.updateAnimal(req, res));

// Rutas de checkpoints
app.get('/API/checkpoints', (req, res) => checkpointController.getCheckpoints(req, res));
app.post('/API/checkpoints', (req, res) => checkpointController.createCheckpoint(req, res));
app.delete('/API/checkpoints/:id', (req, res) => checkpointController.deleteCheckpoint(req, res));
app.patch('/API/checkpoints/:id', (req, res) => checkpointController.updateCheckpoint(req, res));

// Otras rutas
app.get('/API/animals/position', getPosition);
app.get('/API/availableDevices', (req, res) => mqttController.getAllCheckpoints(res));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Iniciar servidor
const PORT = process.env.PORTHTTP || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

module.exports = app;