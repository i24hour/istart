// Quick script to add API key to MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const User = mongoose.model('User', new mongoose.Schema({
    userId: String,
    apiKey: String,
    createdAt: Date,
    updatedAt: Date
}));

async function setApiKey() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'istart',
            bufferCommands: false,
        });

        console.log('✓ Connected to MongoDB');

        // Get user ID from localStorage (you'll need to check browser)
        const userId = process.argv[2] || 'default-user';
        const apiKey = 'AIzaSyDO2Q9VI460iBWogeKM17neOUXRslBYVlo';

        const user = await User.findOneAndUpdate(
            { userId },
            { apiKey, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        console.log('✓ API key saved for user:', userId);
        console.log('✓ User:', user);

        await mongoose.disconnect();
        console.log('✓ Done!');
    } catch (error) {
        console.error('✗ Error:', error);
    }
}

setApiKey();
