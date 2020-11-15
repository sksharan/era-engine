import * as mongodb from 'mongodb';
import {appConfig, isTest} from '../config/index';

let db: mongodb.Db = null;
let bucket = null;

export const getDb = () => db;
export const getBucket = () => bucket;

export const connectDb = () => {
    return new Promise((resolve, reject) => {
        if (db !== null) {
            resolve();
        }
        mongodb.MongoClient.connect(appConfig.database.url, {useUnifiedTopology: true})
            .then(client => {
                if (!isTest) {
                    console.log('Connected to database ');
                }
                db = client.db(appConfig.database.dbName);
                bucket = new mongodb.GridFSBucket(db);
                resolve();
            })
            .catch(err => {
                console.error('Connection error:', err);
                reject();
            });
    });
};
