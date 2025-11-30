import { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { generateProjectId, getTodayDate } from '../utils/helpers';
import { saveProject } from '../utils/storage';

function ProjectSetup({ onProjectCreated, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        milestones: [''],
        deadline: '',
        startDate: getTodayDate(),
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleMilestoneChange = (index, value) => {
        const newMilestones = [...formData.milestones];
        newMilestones[index] = value;
        setFormData(prev => ({ ...prev, milestones: newMilestones }));
    };

    const addMilestone = () => {
        setFormData(prev => ({
            ...prev,
            milestones: [...prev.milestones, '']
        }));
    };

    const removeMilestone = (index) => {
        if (formData.milestones.length > 1) {
            const newMilestones = formData.milestones.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, milestones: newMilestones }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Project description is required';
        }

        const validMilestones = formData.milestones.filter(m => m.trim());
        if (validMilestones.length === 0) {
            newErrors.milestones = 'At least one milestone is required';
        }

        if (!formData.deadline || formData.deadline < 1) {
            newErrors.deadline = 'Deadline must be at least 1 day';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // Create project object
        const project = {
            id: generateProjectId(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            milestones: formData.milestones.filter(m => m.trim()),
            deadline: parseInt(formData.deadline),
            startDate: formData.startDate,
            cumulativeScore: 0,
            currentDay: 1,
            completedMilestones: [],
            createdAt: new Date().toISOString(),
        };

        // Save to storage
        saveProject(project);

        // Navigate to tracking view
        onProjectCreated(project.id);
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <div className="card p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Create New Project</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Project Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="e.g., Portfolio Website"
                                className="input-field"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Describe your project goals, context, and requirements..."
                                rows={4}
                                className="input-field resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Milestones */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Major Milestones *
                            </label>
                            <p className="text-sm text-gray-600 mb-3">
                                List the key deliverables or phases of your project
                            </p>
                            <div className="space-y-3">
                                {formData.milestones.map((milestone, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={milestone}
                                            onChange={(e) => handleMilestoneChange(index, e.target.value)}
                                            placeholder={`Milestone ${index + 1}`}
                                            className="input-field flex-1"
                                        />
                                        {formData.milestones.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMilestone(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                aria-label="Remove milestone"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addMilestone}
                                className="mt-3 flex items-center gap-2 text-water-blue hover:text-water-cyan font-medium text-sm transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Milestone
                            </button>
                            {errors.milestones && (
                                <p className="text-red-500 text-sm mt-2">{errors.milestones}</p>
                            )}
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Deadline (in days) *
                            </label>
                            <input
                                type="number"
                                value={formData.deadline}
                                onChange={(e) => handleChange('deadline', e.target.value)}
                                placeholder="e.g., 5"
                                min="1"
                                className="input-field"
                            />
                            {errors.deadline && (
                                <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
                            )}
                            {formData.deadline > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Max score: {formData.deadline * 20} points (20 per day)
                                </p>
                            )}
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="btn-primary flex-1">
                                Start Tracking
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProjectSetup;
