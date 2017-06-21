import {
    GraphQLInputObjectType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';

import {InputColorType, OutputColorType} from './color-type';
import {InputVec3Type, OutputVec3Type} from './vec3-type';

export const InputLightType = new GraphQLInputObjectType({
    name: 'LightInput',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        type: {
            type: new GraphQLNonNull(GraphQLString)
        },
        position: {
            type: new GraphQLNonNull(InputVec3Type)
        },
        direction: {
            type: new GraphQLNonNull(InputVec3Type)
        },
        ambient: {
            type: new GraphQLNonNull(InputColorType)
        },
        diffuse: {
            type: new GraphQLNonNull(InputColorType)
        },
        specular: {
            type: new GraphQLNonNull(InputColorType)
        },
        intensity: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
});

export const OutputLightType = new GraphQLObjectType({
    name: 'Light',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: (light) => light.id
        },
        name: {
            type: GraphQLString,
            resolve: (light) => light.name
        },
        type: {
            type: GraphQLString,
            resolve: (light) => light.type
        },
        position: {
            type: OutputVec3Type,
            resolve: (light) => light.position
        },
        direction: {
            type: OutputVec3Type,
            resolve: (light) => light.direction
        },
        ambient: {
            type: OutputColorType,
            resolve: (light) => light.ambient
        },
        diffuse: {
            type: OutputColorType,
            resolve: (light) => light.diffuse
        },
        specular: {
            type: OutputColorType,
            resolve: (light) => light.specular
        },
        intensity: {
            type: GraphQLFloat,
            resolve: (light) => light.intensity
        }
    })
});
