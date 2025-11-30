import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user settings (API key)
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        let user = await User.findOne({ userId });
        
        if (!user) {
            user = new User({ userId });
            await user.save();
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user settings' });
    }
});

// Update user settings (API key)
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { apiKey } = req.body;
        
        let user = await User.findOneAndUpdate(
            { userId },
            { apiKey, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user settings' });
    }
});

export default router;
