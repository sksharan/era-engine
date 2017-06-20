import {
    GraphQLNonNull,
    GraphQLString
} from 'graphql';

import mongoose from 'mongoose';

import {InputLightType, OutputLightType} from '../type/light-type';
import {LightModel} from '../../model/index';

export const saveLight = {
    type: OutputLightType,
    args: {
        light: {
            type: new GraphQLNonNull(InputLightType)
        }
    },
    resolve(root, args) {
        return LightModel.findByIdAndUpdate(args.light.id || mongoose.Types.ObjectId(),
                args.light, {upsert: true, new: true}).exec();
    }
}

export const deleteLight = {
    type: OutputLightType,
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve(root, args) {
        return LightModel.findByIdAndRemove(args.id).exec();
    }
};
