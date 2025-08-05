const redis = require('redis');
const logger = require('../utils/logger');

let client = null;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    logger.warn('Redis URL not provided, skipping Redis connection');
    return null;
  }

  try {
    client = redis.createClient({
      url: process.env.REDIS_URL,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          logger.error('Redis server refused connection');
          return new Error('Redis server refused connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          logger.error('Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          logger.error('Redis max retry attempts reached');
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      },
    });

    client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      logger.info('✅ Redis Connected');
    });

    client.on('ready', () => {
      logger.info('Redis Client Ready');
    });

    client.on('end', () => {
      logger.warn('Redis connection ended');
    });

    await client.connect();
    return client;
  } catch (error) {
    logger.error('❌ Redis connection failed:', error.message);
    return null;
  }
};

const getRedisClient = () => client;

const closeRedis = async () => {
  if (client) {
    await client.quit();
    logger.info('Redis connection closed');
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  closeRedis,
};