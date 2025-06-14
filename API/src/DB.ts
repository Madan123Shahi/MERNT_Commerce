import mongoose, { Connection, ConnectOptions, mongo } from "mongoose";
import { ConfigError } from "./errors/CustomErrors.js";
import { logger } from "./utils/Logger.js";
const MONGO_URI = process.env.MONGO_URI;
const poolSize = process.env.MONGO_MAX_POOL_SIZE
  ? parseInt(process.env.MAX_POOL_SIZE)
  : 10;
const connectionTime = process.env.MONGO_CONNECTION_TIMEOUT_MS
  ? parseInt(process.env.MONGO_CONNECTION_TIMEOUT_MS)
  : 5000;
const socketTime = process.env.MONGO_SOCKET_TIMEOUT_MS
  ? parseInt(process.env.MONGO_SOCKET_TIMEOUT_MS)
  : 30000;
const idleTime = process.env.MONGO_MAX_IDLE_TIME_MS
  ? parseInt(process.env.MONGO_MAX_IDLE_TIME_MS)
  : 10000;
const serverTime = process.env.MONGO_SERVER_TIMEOUT_MS
  ? parseInt(process.env.MONGO_SERVER_TIMEOUT_MS)
  : 5000;
if (!MONGO_URI) {
  throw new ConfigError(`Environment Variable is not set for Database`);
}
const options: ConnectOptions = {
  maxPoolSize: poolSize,
  connectTimeoutMS: connectionTime,
  socketTimeoutMS: socketTime,
  maxIdleTimeMS: idleTime,
  serverSelectionTimeoutMS: serverTime,
  retryWrites: true,
  retryReads: true,
};

//MongoDB Connection Caching
let connection: Connection | null = null;

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
