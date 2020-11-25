import { ObjectId } from "mongodb";

export interface User { 
    _id: ObjectId,
    id: ObjectId,
    email: string
    password: string,
}