import {Int32, ObjectId} from 'mongodb';

export interface FileMetadata {
    _id: ObjectId;
    length: Int32;
    chunkSize: Int32;
    uploadDate: Date;
    md5: string;
    filename: string;
}
