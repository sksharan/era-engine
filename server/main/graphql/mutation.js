import {
    GraphQLObjectType
} from 'graphql';

import {saveLight, deleteLight} from './mutation/light-mutation';

export default new GraphQLObjectType({
    name: 'Mutation',
    description: '...',

    fields: () => ({
        saveLight,
        deleteLight
    })
});
