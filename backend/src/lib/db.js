import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if(isConnected){
        console.log("MongoDB already connected");
    }
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        isConnected=true;
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error: ",error);
    }
}