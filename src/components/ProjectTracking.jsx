import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Edit2 } from 'lucide-react';
import { loadProject, saveProject, loadLogs, saveLog, deleteProject } from '../utils/storageApi';
import { getDaysSince, calculateStatus, getTodayLog, getTodayDate } from '../utils/helpers';
import { scoreWork } from '../utils/geminiApi';
import WaterBucketScene from './WaterBucketScene';
import Timeline from './Timeline';
import DailyWorkEntry from './DailyWorkEntry';
import MilestoneChecklist from './MilestoneChecklist';

function ProjectTracking({ projectId, onBack }) {
    const [project, setProject] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [shouldAnimateWater, setShouldAnimateWater] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadProjectData();
    }, [projectId]);

    const loadProjectData = async () => {
        try {
            const projectData = await loadProject(projectId);
            const projectLogs = await loadLogs(projectId);

            if (projectData) {
                // Update current day
                const currentDay = getDaysSince(projectData.startDate);
                projectData.currentDay = currentDay;

                setProject(projectData);
                setLogs(projectLogs);
            }
        } catch (error) {
            console.error('Error loading project:', error);
        }
    };

    const handleSubmitWork = async (workDescription) => {
        setIsLoading(true);
        setError('');
        setShouldAnimateWater(false);

        try {
            // Call Gemini API for scoring
            const result = await scoreWork(project, logs, workDescription);

            // Create log entry
            const logEntry = {
                day: project.currentDay,
                work: workDescription,
                score: result.score,
                date: getTodayDate(),
                analysis: result.analysis,
                suggestion: result.suggestion,
                onTrack: result.onTrack,
            };

            // Save log
            await saveLog(projectId, logEntry);

            // Update project cumulative score
            const updatedProject = {
                ...project,
                cumulativeScore: project.cumulativeScore + result.score,
            };
            await saveProject(updatedProject);

            // Update state
            setProject(updatedProject);
            setLogs([...logs, logEntry]);

            // Trigger water animation
            setShouldAnimateWater(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (showDeleteConfirm) {
            try {
                await deleteProject(projectId);
                onBack();
            } catch (error) {
                console.error('Error deleting project:', error);
                setError('Failed to delete project. Please try again.');
            }
        } else {
            setShowDeleteConfirm(true);
            setTimeout(() => setShowDeleteConfirm(false), 5000);
        }
    };

    const handleToggleMilestone = async (index) => {
        const completedMilestones = project.completedMilestones || [];
        const updatedMilestones = completedMilestones.includes(index)
            ? completedMilestones.filter(i => i !== index)
            : [...completedMilestones, index];

        const updatedProject = {
            ...project,
            completedMilestones: updatedMilestones,
        };

        try {
            await saveProject(updatedProject);
            setProject(updatedProject);
        } catch (error) {
            console.error('Error updating milestones:', error);
        }
    };

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading project...</p>
            </div>
        );
    }

    const currentDay = project.currentDay;
    const status = calculateStatus(project.cumulativeScore, currentDay, project.deadline);
    const todayLog = getTodayLog(logs);
    const maxScore = project.deadline * 20;

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Projects
                    </button>

                    <button
                        onClick={handleDeleteProject}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${showDeleteConfirm
                                ? 'bg-red-600 text-white'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                    >
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        {showDeleteConfirm ? 'Click Again to Delete' : 'Delete Project'}
                    </button>
                </div>

                {/* Project Title and Day Counter */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
                    <p className="text-gray-600 text-lg">
                        Day <span className="font-semibold text-water-blue">{currentDay}</span> of{' '}
                        <span className="font-semibold">{project.deadline}</span>
                    </p>
                </div>

                {/* 3D Water Bucket Visualization */}
                <div className="mb-8">
                    <WaterBucketScene
                        percentage={(project.cumulativeScore / maxScore) * 100}
                        status={status.status}
                        shouldAnimate={shouldAnimateWater}
                    />
                </div>

                {/* Overall Progress Stats */}
                <div className="card p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
                            <p className="text-3xl font-bold text-water-blue">
                                {project.cumulativeScore}<span className="text-xl text-gray-400">/{maxScore}</span>
                            </p>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                                <div
                                    className="h-full gradient-water transition-all duration-500"
                                    style={{ width: `${Math.min((project.cumulativeScore / maxScore) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Status</p>
                            <div className={`inline-block px-6 py-3 rounded-lg font-semibold text-lg bg-${status.color} bg-opacity-15 text-${status.color}`}>
                                {status.icon} {status.label}
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {Math.round((project.cumulativeScore / maxScore) * 100)}%
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {project.deadline - currentDay + 1} days remaining
                            </p>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Left Column: Timeline */}
                    <div>
                        <Timeline
                            logs={logs}
                            currentDay={currentDay}
                            deadline={project.deadline}
                        />
                    </div>

                    {/* Right Column: Daily Work Entry */}
                    <div className="space-y-6">
                        <DailyWorkEntry
                            onSubmitWork={handleSubmitWork}
                            todayLog={todayLog}
                            isLoading={isLoading}
                        />

                        {error && (
                            <div className="card p-4 bg-red-50 border border-red-200">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Milestones Checklist */}
                        <MilestoneChecklist
                            milestones={project.milestones}
                            completedMilestones={project.completedMilestones || []}
                            onToggleMilestone={handleToggleMilestone}
                        />
                    </div>
                </div>

                {/* Project Description */}
                <div className="card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Project Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </div>
            </div>
        </div>
    );
}

export default ProjectTracking;
