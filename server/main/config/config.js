export const isTest = process.env.NODE_ENV === 'test';

export const appConfig = {
    port: isTest ? 3001 : 3000,
    database: {
        url: isTest ? 'mongodb://root:password@localhost/' : 'mongodb://root:password@localhost/',
        dbName: isTest ? 'test' : 'app'
    },
    redis: {
        port: 6379,
        host: 'localhost',
        secret: 'hudfhu9dfh89fdh89df98h'
    }
};
