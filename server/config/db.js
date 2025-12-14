const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn('⚠️  MONGO_URI not set. MongoDB connection skipped. Server will run without database.');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.warn('⚠️  Server will continue without database connection.');
        // Don't exit - allow server to run without DB
    }
};

module.exports = connectDB;
