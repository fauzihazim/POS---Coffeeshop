require('dotenv').config(); // Load environment variables
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL,
    // password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err: unknown) => {
    console.error('Redis Client Error:', err);
});

redisClient.connect().then(() => {
    console.log('Connected to Redis');
});

const connectRedis = async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
};

export { redisClient };