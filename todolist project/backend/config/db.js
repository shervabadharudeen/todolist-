const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses environment variable MONGODB_URI or defaults to local MongoDB instance
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zentask_todo_db';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.error('Note: Ensure MongoDB is running locally, or configure MONGODB_URI in backend/.env with your MongoDB Atlas connection string.');
  }
};

module.exports = connectDB;
