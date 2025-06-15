import "dotenv/config";
import express from "express";
import { connectDB } from "./DB.js";
import { logger } from "./utils/Logger.js";
const app = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);
// console.log(process.env.PORT);
// console.log(process.env.MONGO_URI);
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running successfully at PORT ${PORT}`);
    });
  } catch (err) {
    logger.error(`Error Starting Server`, err);
    process.exit(1);
  }
};

start();
