import * as stream from 'stream';
import {getBucket, getDb, FileMetadataCollection} from '../database/index';
import {ObjectId} from 'mongodb';

interface Metadata {
    filename: string,
}

export const getAllFileMetadata = async () => {
    const cursor = await getDb()
        .collection(FileMetadataCollection)
        .find()
        .sort({uploadDate: -1});
    return cursor.toArray();
};

export const getFileContentStream = fileId => {
    return getBucket().openDownloadStream(new ObjectId(fileId));
};

export const getFileMetadata = (fileId: string | number | ObjectId) => {
    return getDb()
        .collection<Metadata>(FileMetadataCollection)
        .findOne({_id: new ObjectId(fileId)})
        .then(document => {
            return document;
        })
        .catch(err => {
            throw new Error(err);
        });
};

export const uploadFile = (fileReadStream: stream.Readable, filename: string) => {
    return new Promise((resolve, reject) => {
        fileReadStream
            .pipe(getBucket().openUploadStream(filename))
            .on('error', error => {
                reject(error);
            })
            .on('finish', (document) => {
                resolve(document);
            });
    });
};
