const checkpointRepository = require('../repositories/checkpointRepository');

class CheckpointController {
    constructor() {
        // Bind de los métodos
        this.getCheckpoints = this.getCheckpoints.bind(this);
        this.createCheckpoint = this.createCheckpoint.bind(this);
        this.deleteCheckpoint = this.deleteCheckpoint.bind(this);
        this.updateCheckpoint = this.updateCheckpoint.bind(this);
        this.validateCheckpoint = this.validateCheckpoint.bind(this);
        this.getCheckpointsData = this.getCheckpointsData.bind(this);
    }

    async getCheckpoints(req, res) {
        try {
            const checkpoints = await checkpointRepository.getAll();
            res.status(200).json(checkpoints);
        } catch (error) {
            console.error('Error in getCheckpoints:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async createCheckpoint(req, res) {
        try {
            let newCheckpoint = this.parseRequestBody(req.body);
            console.log('Creating checkpoint:', newCheckpoint);

            if (!this.validateCheckpoint(newCheckpoint)) {
                return res.status(400).json({ error: 'Ausencia de datos para llevar a cabo una request' });
            }

            await checkpointRepository.create(newCheckpoint);
            res.status(201).json({ message: 'Checkpoint creado exitosamente' });
        } catch (error) {
            console.error('Error in createCheckpoint:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async deleteCheckpoint(req, res) {
        try {
            const deleted = await checkpointRepository.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Falla en encontrar una ruta/ el contenido solicitado' });
            }
            res.status(200).json({ message: 'Checkpoint eliminado exitosamente' });
        } catch (error) {
            console.error('Error in deleteCheckpoint:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async updateCheckpoint(req, res) {
        try {
            let updatedCheckpoint = this.parseRequestBody(req.body);
            console.log('Updating checkpoint:', updatedCheckpoint);

            if (!this.validateCheckpoint(updatedCheckpoint)) {
                return res.status(400).json({ error: 'Ausencia de datos para llevar a cabo una request' });
            }

            const result = await checkpointRepository.update(req.params.id, updatedCheckpoint);
            if (!result) {
                return res.status(404).json({ error: 'Falla en encontrar una ruta/ el contenido solicitado' });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in updateCheckpoint:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async getCheckpointsData() {
        try {
            return await checkpointRepository.getAll();
        } catch (error) {
            console.error('Error in getCheckpointsData:', error);
            throw error;
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

    validateCheckpoint(checkpoint) {
        try {
            console.log('Validating checkpoint:', checkpoint);
            return checkpoint && 
                   checkpoint.id && 
                   checkpoint.lat && 
                   checkpoint.long && 
                   checkpoint.description;
        } catch (error) {
            console.error('Error validating checkpoint:', error);
            return false;
        }
    }
}

module.exports = CheckpointController;