import {getDb, UserCollection} from '../database/index';
import {ObjectId} from 'mongodb';
import {User} from '../type';

export const getUser = async (id: ObjectId | string): Promise<User>=> {
    return await getDb()
        .collection(UserCollection)
        .findOne({_id: new ObjectId(id)});
};
export const saveUser = async (user: User): Promise<User> => {
    user._id = user.id ? new ObjectId(user.id) : new ObjectId();
    await getDb()
        .collection<User>(UserCollection)
        .findOneAndUpdate({_id: user._id}, {$set: user}, {upsert: true, returnOriginal: false});

    const cursor = getDb().collection<User>(UserCollection).find({_id: user._id});
    return cursor.next();
};
export const getUserByUsername = async (email: string): Promise<User> => {
    return await getDb().collection(UserCollection).findOne({email: email});
};
