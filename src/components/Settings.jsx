import { useState } from 'react';
import { X, Key, Trash2, Download } from 'lucide-react';
import { getApiKey, setApiKey as saveApiKey, clearAllData, loadProjectsList, loadProject, loadLogs } from '../utils/storage';

function Settings({ onClose, isFirstTime }) {
    const [apiKey, setApiKey] = useState(getApiKey());
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [message, setMessage] = useState('');

    const handleSaveApiKey = () => {
        if (!apiKey.trim()) {
            setMessage('Please enter a valid API key');
            return;
        }

        saveApiKey(apiKey);
        setMessage('API key saved successfully!');

        setTimeout(() => {
            if (isFirstTime) {
                onClose();
            }
        }, 1500);
    };

    const handleResetData = () => {
        if (showConfirmReset) {
            clearAllData();
            setMessage('All data cleared successfully!');
            setShowConfirmReset(false);

            setTimeout(() => {
                onClose();
            }, 1500);
        } else {
            setShowConfirmReset(true);
        }
    };

    const handleExportData = () => {
        try {
            const projectIds = loadProjectsList();
            const exportData = {
                exportDate: new Date().toISOString(),
                projects: projectIds.map(id => ({
                    project: loadProject(id),
                    logs: loadLogs(id)
                }))
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `istart-export-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            setMessage('Data exported successfully!');
        } catch (error) {
            setMessage('Failed to export data');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="card p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                        {!isFirstTime && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        )}
                    </div>

                    {isFirstTime && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-blue-900 font-medium">Welcome to iStart!</p>
                            <p className="text-blue-800 text-sm mt-1">
                                Please configure your Gemini API key to enable AI-powered project scoring.
                            </p>
                        </div>
                    )}

                    {/* API Key Section */}
                    <div className="mb-8">
                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                            <Key className="w-5 h-5" />
                            Gemini API Key
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                            Get your API key from{' '}
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-water-blue hover:underline"
                            >
                                Google AI Studio
                            </a>
                        </p>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API key"
                            className="input-field mb-4"
                        />
                        <button onClick={handleSaveApiKey} className="btn-primary">
                            Save API Key
                        </button>
                    </div>

                    {/* Export Data */}
                    <div className="mb-8 pt-8 border-t border-gray-200">
                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                            <Download className="w-5 h-5" />
                            Export Data
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                            Download all your projects and logs as a JSON file
                        </p>
                        <button onClick={handleExportData} className="btn-secondary">
                            Export All Data
                        </button>
                    </div>

                    {/* Reset Data */}
                    <div className="pt-8 border-t border-gray-200">
                        <label className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-3">
                            <Trash2 className="w-5 h-5" />
                            Danger Zone
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                            Clear all projects and logs. This action cannot be undone.
                        </p>
                        <button
                            onClick={handleResetData}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${showConfirmReset
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                }`}
                        >
                            {showConfirmReset ? 'Click Again to Confirm' : 'Reset All Data'}
                        </button>
                        {showConfirmReset && (
                            <button
                                onClick={() => setShowConfirmReset(false)}
                                className="ml-3 btn-secondary"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {/* Message */}
                    {message && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">{message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
