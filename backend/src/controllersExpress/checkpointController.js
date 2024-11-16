const checkpointRepository = require('../repositories/checkpointRepository');
class CheckpointController {
    async getCheckpoints(req, res) {
        try {
            const checkpoints = await checkpointRepository.getAll();
            res.status(200).json(checkpoints);
        } catch (error) {
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async createCheckpoint(req, res) {
        try {
            const newCheckpoint = req.body;
            if (!this.validateCheckpoint(newCheckpoint)) {
                return res.status(400).json({ error: 'Ausencia de datos para llevar a cabo una request' });
            }

            await checkpointRepository.create(newCheckpoint);
            res.status(201).json({ message: 'Checkpoint creado exitosamente' });
        } catch (error) {
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
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async updateCheckpoint(req, res) {
        try {
            const updatedCheckpoint = req.body;
            if (!this.validateCheckpoint(updatedCheckpoint)) {
                return res.status(400).json({ error: 'Ausencia de datos para llevar a cabo una request' });
            }

            const result = await checkpointRepository.update(req.params.id, updatedCheckpoint);
            if (!result) {
                return res.status(404).json({ error: 'Falla en encontrar una ruta/ el contenido solicitado' });
            }

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async getCheckpointsData() {
        return await checkpointRepository.getAll();
    }

    validateCheckpoint(checkpoint) {
        return checkpoint.id && checkpoint.lat && checkpoint.long && checkpoint.description;
    }
}
module.exports = CheckpointController;