import mongoose from "mongoose";
import dns from "node:dns";
import { config } from "./config.js";

const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }

    if (config.mongoUri.startsWith("mongodb+srv://")) {
      const dnsServers = config.mongoDnsServers
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

      if (dnsServers.length > 0) {
        dns.setServers(dnsServers);
      }
    }

    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
