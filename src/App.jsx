import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ProjectSetup from './components/ProjectSetup';
import ProjectTracking from './components/ProjectTracking';
import Settings from './components/Settings';
import { getApiKey } from './utils/storageApi';

function App() {
  const [view, setView] = useState('dashboard'); // dashboard, setup, tracking, settings
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);

  useEffect(() => {
    // Check if API key exists on first load
    const checkApiKey = async () => {
      try {
        const apiKey = await getApiKey();
        if (!apiKey) {
          setShowApiKeyPrompt(true);
        }
      } catch (error) {
        console.error('Error checking API key:', error);
      }
    };
    
    checkApiKey();
  }, []);

  const handleCreateProject = () => {
    setView('setup');
  };

  const handleProjectCreated = (projectId) => {
    setSelectedProjectId(projectId);
    setView('tracking');
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setView('tracking');
  };

  const handleBackToDashboard = () => {
    setSelectedProjectId(null);
    setView('dashboard');
  };

  const handleOpenSettings = () => {
    setView('settings');
  };

  const handleCloseSettings = () => {
    setView('dashboard');
    setShowApiKeyPrompt(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {view === 'dashboard' && (
        <Dashboard
          onCreateProject={handleCreateProject}
          onSelectProject={handleSelectProject}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {view === 'setup' && (
        <ProjectSetup
          onProjectCreated={handleProjectCreated}
          onCancel={handleBackToDashboard}
        />
      )}

      {view === 'tracking' && selectedProjectId && (
        <ProjectTracking
          projectId={selectedProjectId}
          onBack={handleBackToDashboard}
        />
      )}

      {view === 'settings' && (
        <Settings
          onClose={handleCloseSettings}
          isFirstTime={showApiKeyPrompt}
        />
      )}
    </div>
  );
}

export default App;
