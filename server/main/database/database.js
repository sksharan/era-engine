import mongodb from 'mongodb'
import {appConfig, isTest} from '../config/index'

export let db = null;
export let bucket = null;

export const connectDb = () => {
    return new Promise((resolve, reject) => {
        if (db !== null) {
            resolve();
        }
        mongodb.MongoClient.connect(appConfig.database.url)
            .then((database) => {
                if (!isTest) {
                    console.log('Connected to database ' + appConfig.database.url);
                }
                db = database;
                bucket = new mongodb.GridFSBucket(db);
                resolve();
            })
            .catch((err) => {
                console.error('Connection error:', err);
                reject();
            });
    });
};
