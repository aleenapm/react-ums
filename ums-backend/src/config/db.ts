import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string || 'mongodb://127.0.0.1:27017/ums-react')
        console.log("MongoDB Connected....")
    } catch (error) {
        console.error("MongoDB Connection Failed");
        process.exit(1);
    }
}

export default connectDB