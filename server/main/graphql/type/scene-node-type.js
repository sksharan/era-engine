import {
    GraphQLInputObjectType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} from 'graphql'

import SceneNodeContentType from './scene-node-content-type'
import SceneNodeEnumType from './enum/scene-node-enum-type';

export const InputSceneNodeType = new GraphQLInputObjectType({
    name: 'InputSceneNode',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString
        },
        path: {
            // Path includes IDs of ancestor nodes
            type: new GraphQLNonNull(GraphQLString)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        type: {
            type: new GraphQLNonNull(SceneNodeEnumType)
        },
        localMatrix: {
            // A list of 16 elements to represent a 4x4 matrix
            type: new GraphQLList(GraphQLFloat)
        }
    })
});

export const OutputSceneNodeType = new GraphQLObjectType({
    name: 'OutputSceneNodeType',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: (node) => node._id.toString()
        },
        path: {
            // Path includes IDs of ancestor nodes
            type: GraphQLString,
            resolve: (node) => node.path
        },
        name: {
            type: GraphQLString,
            resolve: (node) => node.name
        },
        type: {
            type: GraphQLString,
            resolve: (node) => node.type
        },
        localMatrix: {
            // A list of 16 elements to represent a 4x4 matrix
            type: new GraphQLList(GraphQLFloat),
            resolve: (node) => node.localMatrix
        },
        content: {
            type: SceneNodeContentType,
            resolve: (node) => node.content
        }
    })
});
