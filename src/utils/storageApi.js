// API client for MongoDB backend
import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Get or create user ID
const getUserId = () => {
    let userId = localStorage.getItem('istart-user-id');
    if (!userId) {
        userId = uuidv4();
        localStorage.setItem('istart-user-id', userId);
    }
    return userId;
};

// Projects API
export const loadProjectsList = async () => {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/projects/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const projects = await response.json();
        return projects.map(p => p.id);
    } catch (error) {
        console.error('Error loading projects list:', error);
        return [];
    }
};

export const loadProject = async (projectId) => {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/projects/${userId}/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        return await response.json();
    } catch (error) {
        console.error('Error loading project:', error);
        return null;
    }
};

export const saveProject = async (project) => {
    try {
        const userId = getUserId();
        const isNew = !project._id;
        
        const response = await fetch(
            isNew 
                ? `${API_URL}/api/projects/${userId}`
                : `${API_URL}/api/projects/${userId}/${project.id}`,
            {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project)
            }
        );
        
        if (!response.ok) throw new Error('Failed to save project');
        return await response.json();
    } catch (error) {
        console.error('Error saving project:', error);
        throw error;
    }
};

export const deleteProject = async (projectId) => {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/projects/${userId}/${projectId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete project');
        
        // Also delete logs
        await fetch(`${API_URL}/api/logs/${userId}/${projectId}`, {
            method: 'DELETE'
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};

// Logs API
export const loadLogs = async (projectId) => {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/logs/${userId}/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch logs');
        return await response.json();
    } catch (error) {
        console.error('Error loading logs:', error);
        return [];
    }
};

export const saveLog = async (projectId, log) => {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/logs/${userId}/${projectId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log)
        });
        
        if (!response.ok) throw new Error('Failed to save log');
        return await response.json();
    } catch (error) {
        console.error('Error saving log:', error);
        throw error;
    }
};

// User Settings API
export const getApiKey = async () => {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user settings');
        const user = await response.json();
        return user.apiKey || '';
    } catch (error) {
        console.error('Error getting API key:', error);
        // Fallback to localStorage for backward compatibility
        return localStorage.getItem('istart-api-key') || '';
    }
};

export const setApiKey = async (key) => {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: key })
        });
        
        if (!response.ok) throw new Error('Failed to save API key');
        
        // Also save to localStorage as backup
        localStorage.setItem('istart-api-key', key);
        
        return await response.json();
    } catch (error) {
        console.error('Error setting API key:', error);
        // Fallback to localStorage
        localStorage.setItem('istart-api-key', key);
    }
};

// Export data
export const clearAllData = async () => {
    try {
        const userId = getUserId();
        const projects = await loadProjectsList();
        
        // Delete all projects and their logs
        await Promise.all(projects.map(projectId => deleteProject(projectId)));
        
        // Clear user settings
        await setApiKey('');
        
        console.log('All data cleared');
    } catch (error) {
        console.error('Error clearing data:', error);
        throw error;
    }
};
