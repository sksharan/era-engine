import {
    GraphQLInputObjectType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';

import {InputColorType, OutputColorType} from './color-type';

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
        ambient: {
            type: new GraphQLNonNull(InputColorType)
        },
        diffuse: {
            type: new GraphQLNonNull(InputColorType)
        },
        specular: {
            type: new GraphQLNonNull(InputColorType)
        },
        specularTerm: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        quadraticAttenuation: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        linearAttenuation: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        constantAttenuation: {
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
            resolve: (light) => light._id.toString()
        },
        name: {
            type: GraphQLString,
            resolve: (light) => light.name
        },
        type: {
            type: GraphQLString,
            resolve: (light) => light.type
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
        specularTerm: {
            type: GraphQLFloat,
            resolve: (light) => light.specularTerm
        },
        quadraticAttenuation: {
            type: GraphQLFloat,
            resolve: (light) => light.quadraticAttenuation
        },
        linearAttenuation: {
            type: GraphQLFloat,
            resolve: (light) => light.linearAttenuation
        },
        constantAttenuation: {
            type: GraphQLFloat,
            resolve: (light) => light.constantAttenuation
        }
    })
});
