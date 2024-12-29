import Redis from 'ioredis';
import { configDotenv } from 'dotenv';

configDotenv();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost', 
  port: process.env.REDIS_PORT || 6379, 
  password: process.env.REDIS_PASSWORD, 
  connectTimeout: 10000 
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

redisClient.on('close', () => {
  console.log('Redis connection closed');
});

export default redisClient;