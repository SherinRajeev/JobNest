import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobnest', {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning]: ${error.message}`);
    console.warn(`[JobNest Backend]: Operating with local database / in-memory store fallback mode.`);
    return false;
  }
};
