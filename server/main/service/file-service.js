import {FileDao} from '../dao/index'
import * as streamifier from 'streamifier'

export const getAllFileMetadata = () => {
    return FileDao.getAllFileMetadata();
}

export const getFileContentStream = (fileId) => {
    return FileDao.getFileContentStream(fileId);
}

export const getFileMetadata = (fileId) => {
    return FileDao.getFileMetadata(fileId);
}

export const uploadFile = (fileReadStream, filename) => {
    return FileDao.uploadFile(fileReadStream, filename);
}

export const uploadFiles = (multerFiles) => {
    let promises = [];
    for (let file of multerFiles) {
        const promise = uploadFile(streamifier.createReadStream(file.buffer), file.originalname);
        promises.push(promise);
    }
    return promises;
}
