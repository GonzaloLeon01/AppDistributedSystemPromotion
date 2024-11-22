const animalRepository = require('../repositories/animalRepository'); 

class AnimalController {
    constructor() {
        this.getAnimals = this.getAnimals.bind(this);
        this.createAnimal = this.createAnimal.bind(this);
        this.deleteAnimal = this.deleteAnimal.bind(this);
        this.updateAnimal = this.updateAnimal.bind(this);
        this.validateAnimal = this.validateAnimal.bind(this);
        this.getAnimalsData = this.getAnimalsData.bind(this);
    }

    async getAnimals(req, res) {
        try {
            const animals = await animalRepository.getAll();
            res.status(200).json(animals);
        } catch (error) {
            console.error('Error in getAnimals:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async createAnimal(req, res) {
        try {
            let newAnimal = this.parseRequestBody(req.body);
            
            if (!this.validateAnimal(newAnimal)) {
                return res.status(400).json({ error: 'Ausencia de datos para llevar a cabo una request' });
            }

            await animalRepository.create(newAnimal);
            res.status(201).json({ message: 'Animal creado exitosamente' });
        } catch (error) {
            console.error('Error in createAnimal:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async deleteAnimal(req, res) {
        try {
            const deleted = await animalRepository.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Falla en encontrar una ruta/ el contenido solicitado' });
            }
            res.status(200).json({ message: 'Animal eliminado exitosamente' });
        } catch (error) {
            console.error('Error in deleteAnimal:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async updateAnimal(req, res) {
        try {
            let updatedAnimal = this.parseRequestBody(req.body);
            console.log('Body recibido:', req.body);
            console.log('Animal parseado:', updatedAnimal);

            if (!this.validateAnimal(updatedAnimal)) {
                return res.status(400).json({ error: 'Ausencia de datos para llevar a cabo una request' });
            }

            const result = await animalRepository.update(req.params.id, updatedAnimal);
            if (!result) {
                return res.status(404).json({ error: 'Falla en encontrar una ruta/ el contenido solicitado' });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in updateAnimal:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    parseRequestBody(body) {
        try {
            // Si el body es un objeto con una única clave que parece JSON
            if (typeof body === 'object' && Object.keys(body).length === 1) {
                const key = Object.keys(body)[0];
                if (key.startsWith('{')) {
                    return JSON.parse(key);
                }
            }
            // Si el body ya es un objeto válido
            if (body && typeof body === 'object' && !Array.isArray(body)) {
                return body;
            }
            // Si el body es una cadena JSON
            if (typeof body === 'string') {
                return JSON.parse(body);
            }
            
            return body;
        } catch (error) {
            console.error('Error parsing body:', error);
            return body;
        }
    }

    validateAnimal(animal) {
        try {
            console.log('Validando animal:', animal);
            return animal && animal.id && animal.name && animal.description;
        } catch (error) {
            console.error('Error validando animal:', error);
            return false;
        }
    }

    async getAnimalsData() {
        try {
            return await animalRepository.getAll();
        } catch (error) {
            console.error('Error in getAnimalsData:', error);
            throw error;
        }
    }
}

module.exports = AnimalController;