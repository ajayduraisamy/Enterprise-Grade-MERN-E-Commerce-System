import redis, { isRedisConnected } from "../config/redis";

const safeJsonParse = <T>(raw: string): T | null => {
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
    if (!isRedisConnected()) return null;

    try {
        const value = await redis.get(key);
        if (!value) return null;
        return safeJsonParse<T>(value);
    } catch {
        return null;
    }
};

export const setCache = async (
    key: string,
    value: unknown,
    ttlSeconds: number
): Promise<void> => {
    if (!isRedisConnected()) return;

    try {
        await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch {
        // Cache failures should never break API responses
    }
};

export const deleteCache = async (...keys: string[]): Promise<void> => {
    if (!isRedisConnected() || keys.length === 0) return;

    try {
        await redis.del(...keys);
    } catch {
        // no-op
    }
};

export const clearCacheByPrefix = async (
    prefix: string
): Promise<void> => {
    if (!isRedisConnected()) return;

    try {
        let cursor = "0";

        do {
            const [nextCursor, keys] = await redis.scan(
                cursor,
                "MATCH",
                `${prefix}*`,
                "COUNT",
                100
            );

            cursor = nextCursor;

            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } while (cursor !== "0");
    } catch {
        // no-op
    }
};
