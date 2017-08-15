import {
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLString,
    GraphQLList
} from 'graphql';

import {OutputColorType} from './color-type';

export const OutputObjectType = new GraphQLObjectType({
    name: 'Object',
    description: '...',

    fields: () => ({
        positions: {
            type: new GraphQLList(GraphQLFloat),
            resolve: (object) => object.positions
        },
        normals: {
            type: new GraphQLList(GraphQLFloat),
            resolve: (object) => object.normals
        },
        texcoords: {
            type: new GraphQLList(GraphQLFloat),
            resolve: (object) => object.texcoords
        },
        indices: {
            type: new GraphQLList(GraphQLFloat),
            resolve: (object) => object.indices
        },
        ambient: {
            type: OutputColorType,
            resolve: (object) => object.ambient
        },
        diffuse: {
            type: OutputColorType,
            resolve: (object) => object.diffuse
        },
        specular: {
            type: OutputColorType,
            resolve: (object) => object.specular
        },
        shininess: {
            type: GraphQLFloat,
            resolve: (object) => object.shininess
        },
        textureFileId: {
            type: GraphQLString,
            resolve: (object) => object.textureFileId
        }
    })
});
