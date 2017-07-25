import {
    GraphQLInputObjectType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLNonNull
} from 'graphql';

export const InputColorType = new GraphQLInputObjectType({
    name: 'ColorInput',
    description: '...',

    fields: () => ({
        r: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        b: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        g: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        a: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
});

export const OutputColorType = new GraphQLObjectType({
    name: 'Color',
    description: '...',

    fields: () => ({
        r: {
            type: GraphQLFloat,
            resolve: (color) => color.r
        },
        g: {
            type: GraphQLFloat,
            resolve: (color) => color.g
        },
        b: {
            type: GraphQLFloat,
            resolve: (color) => color.b
        },
        a: {
            type: GraphQLFloat,
            resolve: (color) => color.a
        }
    })
});
