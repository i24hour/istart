import { useState, useEffect } from 'react';
import { Plus, Settings as SettingsIcon, Droplets } from 'lucide-react';
import { loadProjectsList, loadProject, loadLogs } from '../utils/storageApi';
import { formatDate, getDaysSince, calculateStatus } from '../utils/helpers';

function Dashboard({ onCreateProject, onSelectProject, onOpenSettings }) {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setIsLoading(true);
        try {
            const projectIds = await loadProjectsList();
            const projectsData = await Promise.all(
                projectIds.map(async (id) => {
                    const project = await loadProject(id);
                    const logs = await loadLogs(id);
                    return { ...project, logs };
                })
            );
            setProjects(projectsData.filter(p => p && p.id));
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-water flex items-center justify-center shadow-lg">
                            <Droplets className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">iStart</h1>
                            <p className="text-gray-600">Track Your Projects with AI</p>
                        </div>
                    </div>

                    <button
                        onClick={onOpenSettings}
                        className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Settings"
                    >
                        <SettingsIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Create New Project Button */}
                <button
                    onClick={onCreateProject}
                    className="btn-primary w-full sm:w-auto mb-8 flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create New Project
                </button>

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="card p-12 text-center">
                        <div className="animate-spin w-16 h-16 border-4 border-water-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="card p-12 text-center">
                        <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Projects Yet</h2>
                        <p className="text-gray-500">Create your first project to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => {
                            const currentDay = getDaysSince(project.startDate);
                            const status = calculateStatus(project.cumulativeScore, currentDay, project.deadline);
                            const lastLog = project.logs[project.logs.length - 1];

                            return (
                                <div
                                    key={project.id}
                                    onClick={() => onSelectProject(project.id)}
                                    className="card p-6 cursor-pointer transform hover:scale-105 transition-transform duration-200"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{project.name}</h3>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-semibold text-water-blue">{project.cumulativeScore}/100</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full gradient-${status.status === 'on-track' ? 'success' : status.status === 'slightly-behind' ? 'warning' : 'danger'} transition-all duration-500`}
                                                style={{ width: `${Math.min(project.cumulativeScore, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm">
                                            <span className="text-gray-600">Day </span>
                                            <span className="font-semibold text-gray-900">{currentDay}</span>
                                            <span className="text-gray-600"> of </span>
                                            <span className="font-semibold text-gray-900">{project.deadline}</span>
                                        </div>

                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-${status.color} bg-opacity-10 text-${status.color}`}>
                                            {status.icon} {status.label}
                                        </div>
                                    </div>

                                    {/* Last Updated */}
                                    {lastLog && (
                                        <p className="text-sm text-gray-500">
                                            Updated {formatDate(lastLog.date)}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
