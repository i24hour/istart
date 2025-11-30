// Helper utility functions

// Generate unique project ID
export const generateProjectId = () => {
    return `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format date for display
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    }
};

// Calculate days since start date
export const getDaysSince = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + 1; // Day 1 is the start date
};

// Calculate project status based on progress
export const calculateStatus = (cumulativeScore, currentDay, deadline) => {
    const expectedScore = (currentDay / deadline) * 100;
    const actualScore = cumulativeScore;

    // Calculate pace
    const pace = actualScore - expectedScore;

    if (pace >= 0) {
        return {
            status: 'on-track',
            label: 'On Track',
            icon: '✓',
            color: 'success-green',
        };
    } else if (pace > -15) {
        return {
            status: 'slightly-behind',
            label: 'Slightly Behind',
            icon: '⚠️',
            color: 'warning-yellow',
        };
    } else {
        return {
            status: 'behind',
            label: 'Behind Schedule',
            icon: '⚠️',
            color: 'danger-red',
        };
    }
};

// Get water color based on status
export const getWaterColor = (status) => {
    const colors = {
        'on-track': {
            primary: 0x10B981,
            secondary: 0x34D399,
        },
        'slightly-behind': {
            primary: 0xF59E0B,
            secondary: 0xFBBF24,
        },
        'behind': {
            primary: 0xEF4444,
            secondary: 0xF87171,
        },
        'default': {
            primary: 0x4A90E2,
            secondary: 0x3B82F6,
        }
    };

    return colors[status] || colors.default;
};

// Calculate days remaining
export const getDaysRemaining = (startDate, deadline) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + deadline - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Check if log exists for today
export const hasTodayLog = (logs) => {
    const today = getTodayDate();
    return logs.some(log => log.date === today);
};

// Get today's log if it exists
export const getTodayLog = (logs) => {
    const today = getTodayDate();
    return logs.find(log => log.date === today) || null;
};
