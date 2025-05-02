import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(`MongoDB failed to connect: ${error}`);
        process.exit(1);
    }
}

export default connectDB