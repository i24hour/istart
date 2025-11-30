import { Check, Circle, Loader } from 'lucide-react';

function Timeline({ logs, currentDay, deadline }) {
    // Create array of all days (past, present, future)
    const allDays = Array.from({ length: deadline }, (_, i) => i + 1);

    return (
        <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Timeline</h3>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300" />

                {/* Timeline Items */}
                <div className="space-y-6">
                    {allDays.map(day => {
                        const log = logs.find(l => l.day === day);
                        const isPast = day < currentDay;
                        const isCurrent = day === currentDay;
                        const isFuture = day > currentDay;
                        const hasLog = !!log;

                        return (
                            <div key={day} className="relative flex items-start gap-4 pl-10">
                                {/* Node Circle */}
                                <div className="absolute left-0 -ml-1">
                                    {hasLog ? (
                                        <div className="w-8 h-8 rounded-full bg-success-green flex items-center justify-center">
                                            <Check className="w-5 h-5 text-white" />
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="w-8 h-8 rounded-full bg-water-blue animate-pulse-slow flex items-center justify-center">
                                            <Circle className="w-4 h-4 text-white fill-white" />
                                        </div>
                                    ) : isFuture ? (
                                        <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                            <Circle className="w-4 h-4 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-2">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-semibold text-gray-900">DAY {day}</span>
                                        {isCurrent && (
                                            <span className="px-2 py-0.5 bg-water-blue text-white text-xs rounded-full">
                                                Today
                                            </span>
                                        )}
                                    </div>

                                    {hasLog ? (
                                        <div className="mt-2">
                                            <p className="text-gray-700 mb-1">{log.work}</p>
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="font-semibold text-water-blue">+{log.score} points</span>
                                                {log.analysis && (
                                                    <span className="text-gray-600">{log.analysis}</span>
                                                )}
                                            </div>
                                        </div>
                                    ) : isFuture ? (
                                        <p className="text-gray-400 text-sm italic">Upcoming</p>
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">No work logged</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Timeline;
