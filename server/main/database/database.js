import * as mongodb from 'mongodb';
import {appConfig, isTest} from '../config/index';

let db = null;
let bucket = null;

export const getDb = () => db;
export const getBucket = () => bucket;

export const connectDb = () => {
    return new Promise((resolve, reject) => {
        if (db !== null) {
            resolve();
        }
        mongodb.MongoClient.connect(appConfig.database.url)
            .then(database => {
                if (!isTest) {
                    console.log('Connected to database ' + appConfig.database.url);
                }
                db = database;
                bucket = new mongodb.GridFSBucket(db);
                resolve();
            })
            .catch(err => {
                console.error('Connection error:', err);
                reject();
            });
    });
};
