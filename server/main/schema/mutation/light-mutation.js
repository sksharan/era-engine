import {
    GraphQLNonNull,
    GraphQLString
} from 'graphql';

import {InputLightType, OutputLightType} from '../type/light-type';
import {db, LightCollection} from '../../database'
import {ObjectId} from 'mongodb'

export const saveLight = {
    type: OutputLightType,
    args: {
        light: {
            type: new GraphQLNonNull(InputLightType)
        }
    },
    resolve: async (root, args) => {
        const light = args.light;
        light.id = light.id ? new ObjectId(light.id) : new ObjectId();
        await db.collection(LightCollection).findOneAndUpdate(
                {_id: light.id}, {$set: args.light}, {upsert: true, returnOriginal: false});
        return await db.collection(LightCollection).find({_id: light.id}).next();
    }
}

export const deleteLight = {
    type: OutputLightType,
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: async (root, args) => {
        const id = new ObjectId(args.id);
        const deletedDoc = await db.collection(LightCollection).find({_id: id}).next();
        await db.collection(LightCollection).deleteOne({_id: id});
        return deletedDoc;
    }
};
