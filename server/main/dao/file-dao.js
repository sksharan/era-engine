import {bucket, db, FileMetadataCollection} from '../database'
import {ObjectId} from 'mongodb'

export const getFileContentStream = (fileId) => {
    return bucket.openDownloadStream(new ObjectId(fileId));
}

export const getFileMetadata = (fileId) => {
    return db.collection(FileMetadataCollection).findOne({_id: new ObjectId(fileId)})
            .then((document) => {
                return document;
            })
            .catch((err) => {
                throw new Error(err);
            });
}

export const uploadFile = (fileReadStream, filename) => {
    return new Promise((resolve, reject) => {
        fileReadStream.pipe(bucket.openUploadStream(filename))
            .on('error', (error) => {
                reject(error);
            })
            .on('finish', (document) => {
                resolve(document);
            });
    });
}
