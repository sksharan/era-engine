require('dotenv').config();

export const isTest = process.env.NODE_ENV === 'test';

export const appConfig = {
    port: isTest ? 3001 : 3000,
    database: {
        url: isTest ? process.env.CONNSTRING_TEST : process.env.CONNSTRING_PROD,
        dbName: isTest ? process.env.DB_TEST : process.env.DB_PROD
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        secret: process.env.REDIS_SECRET
    }
};
