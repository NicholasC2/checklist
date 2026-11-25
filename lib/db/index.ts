import "server-only";
import mongoose from "mongoose";
import { config } from "dotenv";
config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI ?? "");
  } catch (error: any) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;