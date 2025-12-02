import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log(" MongoDB Connected");
    } catch (error: any) {
        console.error(" MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
