// Storage helper functions for localStorage

const KEYS = {
    PROJECTS_LIST: 'istart-projects-list',
    PROJECT_PREFIX: 'istart-project-',
    LOGS_PREFIX: 'istart-logs-',
    API_KEY: 'istart-api-key',
};

// Projects List
export const loadProjectsList = () => {
    try {
        const list = localStorage.getItem(KEYS.PROJECTS_LIST);
        return list ? JSON.parse(list) : [];
    } catch (error) {
        console.error('Error loading projects list:', error);
        return [];
    }
};

export const saveProjectsList = (list) => {
    try {
        localStorage.setItem(KEYS.PROJECTS_LIST, JSON.stringify(list));
    } catch (error) {
        console.error('Error saving projects list:', error);
    }
};

// Individual Project
export const loadProject = (projectId) => {
    try {
        const project = localStorage.getItem(`${KEYS.PROJECT_PREFIX}${projectId}`);
        return project ? JSON.parse(project) : null;
    } catch (error) {
        console.error('Error loading project:', error);
        return null;
    }
};

export const saveProject = (project) => {
    try {
        // Save project data
        localStorage.setItem(`${KEYS.PROJECT_PREFIX}${project.id}`, JSON.stringify(project));

        // Update projects list if new
        const list = loadProjectsList();
        if (!list.includes(project.id)) {
            list.push(project.id);
            saveProjectsList(list);
        }
    } catch (error) {
        console.error('Error saving project:', error);
    }
};

export const deleteProject = (projectId) => {
    try {
        // Remove project data
        localStorage.removeItem(`${KEYS.PROJECT_PREFIX}${projectId}`);

        // Remove logs
        localStorage.removeItem(`${KEYS.LOGS_PREFIX}${projectId}`);

        // Update projects list
        const list = loadProjectsList();
        const updatedList = list.filter(id => id !== projectId);
        saveProjectsList(updatedList);
    } catch (error) {
        console.error('Error deleting project:', error);
    }
};

// Project Logs
export const loadLogs = (projectId) => {
    try {
        const logs = localStorage.getItem(`${KEYS.LOGS_PREFIX}${projectId}`);
        return logs ? JSON.parse(logs) : [];
    } catch (error) {
        console.error('Error loading logs:', error);
        return [];
    }
};

export const saveLog = (projectId, log) => {
    try {
        const logs = loadLogs(projectId);
        logs.push(log);
        localStorage.setItem(`${KEYS.LOGS_PREFIX}${projectId}`, JSON.stringify(logs));
    } catch (error) {
        console.error('Error saving log:', error);
    }
};

// API Key
export const getApiKey = () => {
    try {
        return localStorage.getItem(KEYS.API_KEY) || '';
    } catch (error) {
        console.error('Error getting API key:', error);
        return '';
    }
};

export const setApiKey = (key) => {
    try {
        localStorage.setItem(KEYS.API_KEY, key);
    } catch (error) {
        console.error('Error setting API key:', error);
    }
};

// Clear all data (for settings reset)
export const clearAllData = () => {
    try {
        const list = loadProjectsList();
        list.forEach(projectId => {
            localStorage.removeItem(`${KEYS.PROJECT_PREFIX}${projectId}`);
            localStorage.removeItem(`${KEYS.LOGS_PREFIX}${projectId}`);
        });
        localStorage.removeItem(KEYS.PROJECTS_LIST);
    } catch (error) {
        console.error('Error clearing data:', error);
    }
};
