import express from 'express';
import Log from '../models/Log.js';

const router = express.Router();

// Get all logs for a project
router.get('/:userId/:projectId', async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        const logs = await Log.find({ userId, projectId }).sort({ day: 1 });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// Create new log
router.post('/:userId/:projectId', async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        const logData = { ...req.body, userId, projectId };
        
        const log = new Log(logData);
        await log.save();
        
        res.status(201).json(log);
    } catch (error) {
        console.error('Error creating log:', error);
        res.status(500).json({ error: 'Failed to create log' });
    }
});

export default router;
