import {FileDao} from '../dao/index';
import * as streamifier from 'streamifier';
import * as stream from 'stream';

export const getAllFileMetadata = () => {
    return FileDao.getAllFileMetadata();
};

export const getFileContentStream = fileId => {
    return FileDao.getFileContentStream(fileId);
};

export const getFileMetadata = fileId => {
    return FileDao.getFileMetadata(fileId);
};

export const uploadFile = (fileReadStream: stream.Readable, filename: string) => {
    return FileDao.uploadFile(fileReadStream, filename);
};

export const uploadFiles = multerFiles => {
    let promises = [];
    for (let file of multerFiles) {
        const promise = uploadFile(streamifier.createReadStream(file.buffer), file.originalname);
        promises.push(promise);
    }
    return promises;
};
