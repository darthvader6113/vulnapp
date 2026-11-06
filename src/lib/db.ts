import mongoose from "mongoose";

const PRIMARY_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vulnlms";
const FALLBACK_URI = PRIMARY_URI.includes("mongo:")
  ? PRIMARY_URI.replace("mongo:", "127.0.0.1:")
  : "mongodb://127.0.0.1:27017/vulnlms";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectWithRetry(uri: string, retries = 3, delayMs = 1500): Promise<typeof mongoose> {
  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await mongoose.connect(uri, opts);
    } catch (err: any) {
      const isDnsError =
        err?.code === "ENOTFOUND" ||
        err?.message?.includes("getaddrinfo") ||
        err?.message?.includes("EAI_AGAIN");

      if (attempt < retries && !isDnsError) {
        console.warn(`[DB] Connection attempt ${attempt} failed: ${err.message}. Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }

  throw new Error(`Failed to connect to MongoDB at ${uri} after ${retries} attempts`);
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connectWithRetry(PRIMARY_URI).catch(async (primaryErr: any) => {
      const isDnsError =
        primaryErr?.code === "ENOTFOUND" ||
        primaryErr?.message?.includes("getaddrinfo") ||
        primaryErr?.message?.includes("EAI_AGAIN");

      if (isDnsError && PRIMARY_URI !== FALLBACK_URI) {
        console.warn(`[DB] Primary URI ${PRIMARY_URI} failed with DNS resolution (${primaryErr.message}). Attempting fallback to ${FALLBACK_URI}...`);
        return connectWithRetry(FALLBACK_URI);
      }
      throw primaryErr;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
