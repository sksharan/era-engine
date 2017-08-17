import {
    GraphQLInputObjectType,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';

export const InputObjectRefType = new GraphQLInputObjectType({
    name: 'ObjectRefInput',
    description: '...',

    fields: () => ({
        objectSceneNodeId: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
});

export const OutputObjectRefType = new GraphQLObjectType({
    name: 'ObjectRef',
    description: '...',

    fields: () => ({
        objectSceneNodeId: {
            type: GraphQLString,
            resolve: (objectRef) => objectRef.objectSceneNodeId
        }
    })
});
