import {getDb, SceneNodeCollection} from '../database/index';
import {ObjectId} from 'mongodb';

export const getSceneNode = async id => {
    return await getDb()
        .collection(SceneNodeCollection)
        .findOne({_id: new ObjectId(id)});
};

export const getSceneNodes = async pathRegex => {
    const cursor = getDb()
        .collection(SceneNodeCollection)
        .find({path: pathRegex})
        .sort({path: 1});
    return cursor.toArray();
};

export const saveSceneNode = async sceneNode => {
    sceneNode._id = sceneNode.id ? new ObjectId(sceneNode.id) : new ObjectId();

    await getDb()
        .collection(SceneNodeCollection)
        .findOneAndUpdate({_id: sceneNode._id}, {$set: sceneNode}, {upsert: true, returnOriginal: false});

    const cursor = await getDb()
        .collection(SceneNodeCollection)
        .find({_id: sceneNode._id});
    return cursor.next();
};

export const deleteSceneNodes = async pathRegex => {
    const cursor = await getDb()
        .collection(SceneNodeCollection)
        .find({path: pathRegex});
    if (!(await cursor.hasNext())) {
        throw new Error('No valid paths found using regex ' + pathRegex);
    }
    const deletedDocs = await cursor.toArray();

    await getDb()
        .collection(SceneNodeCollection)
        .deleteMany({path: pathRegex});
    return deletedDocs;
};
