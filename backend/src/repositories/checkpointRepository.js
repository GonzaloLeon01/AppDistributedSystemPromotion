const fs = require('fs').promises;
const path = require('path');
const checkpointsFilePath = path.join(__dirname, '../models/checkpoints.json');

class CheckpointRepository {
    async getAll() {
        const data = await fs.readFile(checkpointsFilePath);
        const checkpoints = JSON.parse(data);
        return checkpoints.data;
    }

    async create(checkpoint) {
        const checkpoints = await this.getAll();
        checkpoints.push(checkpoint);
        await fs.writeFile(checkpointsFilePath, JSON.stringify({ data: checkpoints }));
        return checkpoint;
    }

    async delete(id) {
        const checkpoints = await this.getAll();
        const index = checkpoints.findIndex(checkpoint => checkpoint.id === id);
        if (index === -1) return null;
        
        const deleted = checkpoints.splice(index, 1)[0];
        await fs.writeFile(checkpointsFilePath, JSON.stringify({ data: checkpoints }));
        return deleted;
    }

    async update(id, updatedCheckpoint) {
        const checkpoints = await this.getAll();
        const index = checkpoints.findIndex(checkpoint => checkpoint.id === id);
        if (index === -1) return null;
        
        checkpoints[index] = { ...checkpoints[index], ...updatedCheckpoint };
        await fs.writeFile(checkpointsFilePath, JSON.stringify({ data: checkpoints }));
        return checkpoints[index];
    }
}

module.exports = new CheckpointRepository();