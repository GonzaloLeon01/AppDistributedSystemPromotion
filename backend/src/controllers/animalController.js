const animalRepository = require("../repositories/animalRepository");

class AnimalController {
  async getAnimals(req, res) {
    try {
      const animals = await animalRepository.getAll();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(animals));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Error al obtener animales" }));
    }
  }

  async createAnimal(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const newAnimal = JSON.parse(body);
        if (!this.validateAnimal(newAnimal)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Faltan campos requeridos" }));
          return;
        }

        await animalRepository.create(newAnimal);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Animal creado exitosamente" }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error al procesar el JSON" }));
      }
    });
  }

  async deleteAnimal(req, res, id) {
    try {
      console.log(id);
      //const deleted = await animalRepository.delete(parseInt(id));
      const deleted = await animalRepository.delete(id);
      console.log(deleted);
      if (!deleted) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Animal no encontrado" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Animal eliminado exitosamente" }));
    } catch (error) {
      console.log(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Error al eliminar animal" }));
    }
  }

  async updateAnimal(req, res, id) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const updatedAnimal = JSON.parse(body);
        if (!this.validateAnimal(updatedAnimal)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Faltan campos requeridos" }));
          return;
        }

        const result = await animalRepository.update(
          id,
          updatedAnimal
        );
        if (!result) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Animal no encontrado" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error al procesar el JSON" }));
      }
    });
  }

  validateAnimal(animal) {
    return animal.id && animal.name && animal.description;
  }

  async getAnimal() {
    const animals = await animalRepository.getAll();
  }

  async getAnimalsData() {
    const animals = await animalRepository.getAll();
    return animals;
  }
}

module.exports = new AnimalController();
