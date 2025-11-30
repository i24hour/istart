import { Check, Square } from 'lucide-react';

function MilestoneChecklist({ milestones, completedMilestones, onToggleMilestone }) {
    const completedCount = completedMilestones.length;
    const totalCount = milestones.length;
    const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Milestones</h3>
                <span className="text-sm font-semibold text-gray-600">
                    {completedCount}/{totalCount} completed
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full gradient-success transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                />
            </div>

            {/* Milestones List */}
            <div className="space-y-3">
                {milestones.map((milestone, index) => {
                    const isCompleted = completedMilestones.includes(index);

                    return (
                        <button
                            key={index}
                            onClick={() => onToggleMilestone(index)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 ${isCompleted ? 'bg-success-green bg-opacity-5' : ''
                                }`}
                        >
                            <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${isCompleted
                                    ? 'bg-success-green text-white'
                                    : 'border-2 border-gray-300'
                                }`}>
                                {isCompleted && <Check className="w-4 h-4" />}
                            </div>

                            <span className={`flex-1 text-left ${isCompleted
                                    ? 'text-gray-500 line-through'
                                    : 'text-gray-900 font-medium'
                                }`}>
                                {milestone}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default MilestoneChecklist;
