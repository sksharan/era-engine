import * as stream from 'stream';
import {getBucket, getDb, FileMetadataCollection} from '../database';
import {GridFSBucketReadStream, ObjectId} from 'mongodb';
import {FileMetadata} from '../type';

export const getAllFileMetadata = async (): Promise<FileMetadata[]> => {
    const cursor = getDb().collection<FileMetadata>(FileMetadataCollection).find().sort({uploadDate: -1});
    return cursor.toArray();
};

export const getFileContentStream = (fileId: ObjectId | string): GridFSBucketReadStream => {
    return getBucket().openDownloadStream(new ObjectId(fileId));
};

export const getFileMetadata = async (fileId: ObjectId | string): Promise<FileMetadata> => {
    try {
        const document = await getDb()
            .collection<FileMetadata>(FileMetadataCollection)
            .findOne({_id: new ObjectId(fileId)});
        return document;
    } catch (err) {
        throw new Error(err);
    }
};

export const uploadFile = (fileReadStream: stream.Readable, filename: string): Promise<FileMetadata> => {
    return new Promise((resolve, reject) => {
        fileReadStream
            .pipe(getBucket().openUploadStream(filename))
            .on('error', error => {
                reject(error);
            })
            .on('finish', (document: FileMetadata) => {
                resolve(document);
            });
    });
};
