import {
    GraphQLInputObjectType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLNonNull
} from 'graphql';

export const InputVec3Type = new GraphQLInputObjectType({
    name: 'Vec3Input',
    description: '...',

    fields: () => ({
        x: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        y: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        z: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
});

export const OutputVec3Type = new GraphQLObjectType({
    name: 'Vec3',
    description: '...',

    fields: () => ({
        x: {
            type: GraphQLFloat,
            resolve: (vec3) => vec3.x
        },
        y: {
            type: GraphQLFloat,
            resolve: (vec3) => vec3.y
        },
        z: {
            type: GraphQLFloat,
            resolve: (vec3) => vec3.z
        }
    })
});
