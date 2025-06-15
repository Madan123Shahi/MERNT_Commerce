import mongoose, { Connection, ConnectOptions } from "mongoose";
import { logger } from "./utils/Logger.js";
import { ConfigError } from "./errors/CustomErrors.js";
import {
  MONGO_URI,
  poolSize,
  connectionTime,
  socketTime,
  idleTime,
  serverTime,
} from "./utils/MongoConnect.js";

const options: ConnectOptions = {
  maxPoolSize: poolSize,
  connectTimeoutMS: connectionTime,
  socketTimeoutMS: socketTime,
  maxIdleTimeMS: idleTime,
  serverSelectionTimeoutMS: serverTime,
  retryWrites: true,
  retryReads: true,
};

let connection: Connection | null = null;

if (!MONGO_URI) {
  throw new ConfigError("MONGO_URI is not defined in .env file");
}

export const connectDB = async (): Promise<Connection> => {
  if (connection) {
    logger.info(`Using existing database connection `);
    return connection;
  }
  try {
    logger.info("Creating a new Database Connection");
    mongoose.connection.on("connected", () => {
      logger.info("Mongoose Connected to DB");
    });
    mongoose.connection.on("disconnected", () => {
      logger.info("Mongoose disconnected from DB");
    });
    mongoose.connection.on("error", (err) => {
      logger.error(`Mongoose connection error`, err);
    });
    await mongoose.connect(MONGO_URI, options);
    connection = mongoose.connection;

    // Close the mongoose connection when the node process ends
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("Mongoose connection closed due to application termination");
      process.exit(0);
    });
    return connection;
  } catch (err) {
    logger.error("Database Connectin Failed", err);
    process.exit(1);
  }
};
