import {
    GraphQLSchema
} from 'graphql';

import Query from './query';
import Mutation from './mutation';

export const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});
