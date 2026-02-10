import mongoose from 'mongoose';

const connectDB = async (URL) => {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(URL);
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  }
};
export default connectDB;