import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    milestones: [{
        type: String
    }],
    deadline: {
        type: Number,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    cumulativeScore: {
        type: Number,
        default: 0
    },
    currentDay: {
        type: Number,
        default: 1
    },
    completedMilestones: [{
        type: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
projectSchema.index({ userId: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
