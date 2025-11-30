import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    day: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 20
    },
    date: {
        type: String,
        required: true
    },
    analysis: {
        type: String,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },
    onTrack: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
logSchema.index({ projectId: 1, day: 1 });
logSchema.index({ userId: 1, createdAt: -1 });

const Log = mongoose.model('Log', logSchema);

export default Log;
