import redis from 'redis';
import { logger } from './logger.js';

let cacheClient = null;
const memoryCache = new Map();
const CACHE_TTL = 5 * 60; // 5 minutes in seconds

// Initialize Redis if available, otherwise use in-memory cache
export const initCache = async () => {
  // Only try Redis if explicitly configured and host is provided
  if (process.env.REDIS_HOST && process.env.REDIS_HOST.trim() !== '') {
    try {
      cacheClient = redis.createClient({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 3) {
              logger.warn('Redis connection failed after multiple retries, using in-memory cache');
              cacheClient = null;
              return new Error('Redis connection failed');
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      cacheClient.on('error', (err) => {
        // Only log once, then disable Redis
        if (cacheClient !== null) {
          logger.warn('Redis connection error, falling back to in-memory cache', { error: err.message });
          cacheClient = null;
        }
      });

      // Set connection timeout
      const connectPromise = cacheClient.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis connection timeout')), 2000)
      );

      await Promise.race([connectPromise, timeoutPromise]);
      logger.info('Redis cache connected');
    } catch (error) {
      logger.warn('Redis connection failed, using in-memory cache', { error: error.message });
      cacheClient = null;
    }
  } else {
    logger.info('Redis not configured, using in-memory cache');
  }
};

export const getCache = async (key) => {
  try {
    if (cacheClient) {
      try {
        const value = await cacheClient.get(key);
        return value ? JSON.parse(value) : null;
      } catch (redisError) {
        // If Redis fails, fall back to memory cache
        cacheClient = null;
        const item = memoryCache.get(key);
        if (item && Date.now() < item.expiry) {
          return item.value;
        }
        memoryCache.delete(key);
        return null;
      }
    } else {
      const item = memoryCache.get(key);
      if (item && Date.now() < item.expiry) {
        return item.value;
      }
      memoryCache.delete(key);
      return null;
    }
  } catch (error) {
    // Silently fall back to memory cache on any error
    const item = memoryCache.get(key);
    if (item && Date.now() < item.expiry) {
      return item.value;
    }
    memoryCache.delete(key);
    return null;
  }
};

export const setCache = async (key, value, ttl = CACHE_TTL) => {
  try {
    if (cacheClient) {
      try {
        await cacheClient.setEx(key, ttl, JSON.stringify(value));
      } catch (redisError) {
        // If Redis fails, fall back to memory cache
        cacheClient = null;
        memoryCache.set(key, {
          value,
          expiry: Date.now() + (ttl * 1000)
        });
      }
    } else {
      memoryCache.set(key, {
        value,
        expiry: Date.now() + (ttl * 1000)
      });
    }
  } catch (error) {
    // Silently fall back to memory cache
    memoryCache.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000)
    });
  }
};

export const deleteCache = async (key) => {
  try {
    if (cacheClient) {
      try {
        await cacheClient.del(key);
      } catch (redisError) {
        // If Redis fails, fall back to memory cache
        cacheClient = null;
        memoryCache.delete(key);
      }
    } else {
      memoryCache.delete(key);
    }
  } catch (error) {
    // Silently fall back to memory cache
    memoryCache.delete(key);
  }
};

