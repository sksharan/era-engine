import {MongoClient} from 'mongodb'
import config from './config'

// Must call connectDb() first to initialize
export let db = null;

export const connectDb = () => {
    return new Promise((resolve, reject) => {
        if (db !== null) {
            resolve();
        }
        MongoClient.connect(config.database.url)
            .then((database) => {
                console.log('Connected to database ' + config.database.url);
                db = database;
                resolve();
            })
            .catch((err) => {
                console.error('Connection error:', err);
                reject();
            });
    });
};

export const LightCollection = 'lights';
