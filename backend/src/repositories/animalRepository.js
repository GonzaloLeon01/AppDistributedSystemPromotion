const fs = require('fs').promises;
const path = require('path');
const animalsFilePath = path.join(__dirname, '../models/animals.json');

class AnimalRepository {
    async getAll() {
        const data = await fs.readFile(animalsFilePath);
        const animals = JSON.parse(data);
        return animals.data;
    }

    async create(animal) {
        const animals = await this.getAll();
        animals.push(animal);
        await fs.writeFile(animalsFilePath, JSON.stringify({ data: animals }));
        return animal;
    }

    async delete(id) {
        const animals = await this.getAll();
        const index = animals.findIndex(animal => animal.id === id);
        if (index === -1) return null;
        
        const deleted = animals.splice(index, 1)[0];
        await fs.writeFile(animalsFilePath, JSON.stringify({ data: animals }));
        return deleted;
    }

    async update(id, updatedAnimal) {
        const animals = await this.getAll();
        const index = animals.findIndex(animal => animal.id === id);
        if (index === -1) return null;
        
        animals[index] = { ...animals[index], ...updatedAnimal };   //todos los atributos que estaban y no aparecen quedan igual y se cambian los nuevos
        await fs.writeFile(animalsFilePath, JSON.stringify({ data: animals }));
        return animals[index];
    }
}

module.exports = new AnimalRepository();