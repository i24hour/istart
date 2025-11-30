import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log('✓ Using existing MongoDB connection');
        return;
    }

    try {
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        const db = await mongoose.connect(mongoUri, {
            dbName: 'istart',
            bufferCommands: false,
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('✓ MongoDB connected successfully');
        return db;
    } catch (error) {
        console.error('✗ MongoDB connection error:', error);
        throw error;
    }
};

export const disconnectDB = async () => {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('✓ MongoDB disconnected');
    } catch (error) {
        console.error('✗ MongoDB disconnection error:', error);
        throw error;
    }
};
