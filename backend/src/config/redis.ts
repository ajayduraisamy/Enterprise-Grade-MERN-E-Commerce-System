import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1
});

let redisReady = false;

redis.on("ready", () => {
    redisReady = true;
    console.log(" Redis Connected");
});

redis.on("end", () => {
    redisReady = false;
});

redis.on("error", (err) => {
    redisReady = false;
    const message = err instanceof Error ? err.message : String(err);
    console.error(" Redis Error:", message);
});

redis.connect().catch(() => {
    console.warn(" Redis unavailable. Continuing without cache.");
});

export const isRedisConnected = () => redisReady;

export default redis;
