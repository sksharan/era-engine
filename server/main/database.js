import mongodb from 'mongodb'
import config, {isTest} from './config'

// Must call connectDb() first to initialize
export let db = null;
export let bucket = null;

export const connectDb = () => {
    return new Promise((resolve, reject) => {
        if (db !== null) {
            resolve();
        }
        mongodb.MongoClient.connect(config.database.url)
            .then((database) => {
                if (!isTest) {
                    console.log('Connected to database ' + config.database.url);
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

export const FileMetadataCollection = 'fs.files';
export const FileChunkCollection = 'fs.chunks';
export const LightCollection = 'lights';
export const SceneNodeCollection = 'sceneNodes';
