import {db, LightCollection} from '../database'
import {ObjectId} from 'mongodb'

export const getAllLights = async () => {
    const cursor = await db.collection(LightCollection).find({});
    return cursor.toArray();
}

export const upsertLight = async (light) => {
    light.id = light.id ? new ObjectId(light.id) : new ObjectId();

    await db.collection(LightCollection).findOneAndUpdate(
            {_id: light.id},
            {$set: light},
            {upsert: true, returnOriginal: false});

    const cursor = await db.collection(LightCollection).find({_id: light.id});
    return await cursor.next();
}

export const deleteLight = async (lightId) => {
    const id = new ObjectId(lightId);

    const cursor = await db.collection(LightCollection).find({_id: id});
    if (!(await cursor.hasNext())) {
        throw new Error("No light found with id " + lightId);
    }
    const deletedDoc = await cursor.next();

    await db.collection(LightCollection).deleteOne({_id: id});
    return deletedDoc;
}
