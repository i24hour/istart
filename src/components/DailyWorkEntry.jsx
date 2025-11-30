import { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';

function DailyWorkEntry({ onSubmitWork, todayLog, isLoading }) {
    const [work, setWork] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!work.trim()) {
            setError('Please describe what you did today');
            return;
        }

        setError('');
        onSubmitWork(work);
    };

    // If already logged today, show the results
    if (todayLog) {
        return (
            <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Progress</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            What you did:
                        </label>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{todayLog.work}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-water text-white p-4 rounded-lg">
                            <p className="text-sm opacity-90 mb-1">Today's Score</p>
                            <p className="text-3xl font-bold">+{todayLog.score}</p>
                            <p className="text-sm opacity-90 mt-1">out of 20 points</p>
                        </div>

                        <div className={`p-4 rounded-lg ${todayLog.onTrack
                                ? 'bg-success-green bg-opacity-10 border border-success-green'
                                : 'bg-warning-yellow bg-opacity-10 border border-warning-yellow'
                            }`}>
                            <p className="text-sm font-semibold mb-1">Status</p>
                            <p className={`text-lg font-bold ${todayLog.onTrack ? 'text-success-green' : 'text-warning-yellow'}`}>
                                {todayLog.onTrack ? '✓ On Track' : '⚠️ Behind Schedule'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">AI Analysis</p>
                        <p className="text-gray-900 mb-3">{todayLog.analysis}</p>

                        <p className="text-sm font-semibold text-gray-700 mb-2">💡 Suggestion for Tomorrow</p>
                        <p className="text-gray-900">{todayLog.suggestion}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Entry form for new work log
    return (
        <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                📝 What did you do today?
            </h3>

            <textarea
                value={work}
                onChange={(e) => setWork(e.target.value)}
                placeholder="Describe the work you completed today..."
                rows={4}
                className="input-field resize-none mb-4"
                disabled={isLoading}
            />

            {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Getting AI Score...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        Get AI Score
                    </>
                )}
            </button>
        </div>
    );
}

export default DailyWorkEntry;
