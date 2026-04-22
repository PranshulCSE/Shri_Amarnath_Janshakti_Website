const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('📡 Connecting to MongoDB...');
    console.log('🔗 URI:', process.env.MONGO_URI?.substring(0, 50) + '...');

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.error('❌ Stack:', err.stack);
    throw err;
  }
};

module.exports = connectDB;