import mongoose from "mongoose";
import db_config from "./config/db_config";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(db_config.mongoURI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (e) {
    console.error("Database connection failed:", e);
    process.exit(1); // Exit the process with failure
  }
};

export default { connectDB };
