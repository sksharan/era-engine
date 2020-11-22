import {getDb, UserCollection} from '../database/index';
import {ObjectId} from 'mongodb';

export const getUser = async id => {
    return await getDb()
        .collection(UserCollection)
        .findOne({_id: new ObjectId(id)});
};
export const saveUser = async user => {
    user._id = user.id ? new ObjectId(user.id) : new ObjectId();
    await getDb()
        .collection(UserCollection)
        .findOneAndUpdate({_id: user._id}, {$set: user}, {upsert: true, returnOriginal: false});

    const cursor = await getDb()
        .collection(UserCollection)
        .find({_id: user._id});
    return cursor.next();
};
export const getUserByUsername = async email => {
    return await getDb()
        .collection(UserCollection)
        .findOne({email: email});
};
