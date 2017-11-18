import {bucket, db, FileMetadataCollection} from '../database/index'
import {ObjectId} from 'mongodb'

export const getAllFileMetadata = async () => {
    const cursor = await db.collection(FileMetadataCollection).find().sort({uploadDate: -1});
    return cursor.toArray();
}

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
