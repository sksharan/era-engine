import {
    GraphQLNonNull,
    GraphQLString
} from 'graphql';

import {InputLightType, OutputLightType} from '../type/light-type'
import * as LightService from '../../service/light-service'

export const saveLight = {
    type: OutputLightType,
    args: {
        light: {
            type: new GraphQLNonNull(InputLightType)
        }
    },
    resolve: async (root, args) => {
        return LightService.upsertLight(args.light);
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
        return LightService.deleteLight(args.id);
    }
};
