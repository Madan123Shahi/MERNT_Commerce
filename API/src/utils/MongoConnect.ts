export const MONGO_URI = process.env.MONGO_URI;
export const poolSize = process.env.MONGO_MAX_POOL_SIZE
  ? parseInt(process.env.MONGO_MAX_POOL_SIZE)
  : 10;
export const connectionTime = process.env.MONGO_CONNECTION_TIMEOUT_MS
  ? parseInt(process.env.MONGO_CONNECTION_TIMEOUT_MS)
  : 5000;
export const socketTime = process.env.MONGO_SOCKET_TIMEOUT_MS
  ? parseInt(process.env.MONGO_SOCKET_TIMEOUT_MS)
  : 3000;
export const idleTime = process.env.MONGO_MAX_IDLE_TIME_MS
  ? parseInt(process.env.MONGO_MAX_IDLE_TIME_MS)
  : 10000;
export const serverTime = process.env.MONGO_SERVER_TIMEOUT_MS
  ? parseInt(process.env.MONGO_SERVER_TIMEOUT_MS)
  : 5000;
