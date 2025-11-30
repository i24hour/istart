import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// Get all projects for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const projects = await Project.find({ userId }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get single project
router.get('/:userId/:projectId', async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        const project = await Project.findOne({ userId, id: projectId });
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Create new project
router.post('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const projectData = { ...req.body, userId };
        
        const project = new Project(projectData);
        await project.save();
        
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update project
router.put('/:userId/:projectId', async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        const updates = req.body;
        
        const project = await Project.findOneAndUpdate(
            { userId, id: projectId },
            { ...updates, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        res.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete project
router.delete('/:userId/:projectId', async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        
        const project = await Project.findOneAndDelete({ userId, id: projectId });
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;
