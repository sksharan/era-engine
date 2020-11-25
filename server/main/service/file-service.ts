import {FileDao} from '../dao/index';
// @ts-ignore
import * as streamifier from 'streamifier';
import * as stream from 'stream';
import {ObjectId} from 'mongodb';

export const getAllFileMetadata = () => {
    return FileDao.getAllFileMetadata();
};

export const getFileContentStream = (fileId: ObjectId | string) => {
    return FileDao.getFileContentStream(fileId);
};

export const getFileMetadata = (fileId: ObjectId | string) => {
    return FileDao.getFileMetadata(fileId);
};

export const uploadFile = (fileReadStream: stream.Readable, filename: string) => {
    return FileDao.uploadFile(fileReadStream, filename);
};

export const uploadFiles = (multerFiles: Express.Multer.File[]) => {
    let promises = [];
    for (let file of multerFiles) {
        const promise = uploadFile(streamifier.createReadStream(file.buffer), file.originalname);
        promises.push(promise);
    }
    return promises;
};
