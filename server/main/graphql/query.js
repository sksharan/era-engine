import {
    GraphQLObjectType
} from 'graphql';

import LightField from './query/light-field';

export default new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
        light: LightField
    })
});
