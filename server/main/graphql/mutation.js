import {
    GraphQLObjectType
} from 'graphql';

import {saveLight, deleteLight} from './mutation/light-mutation';
import {saveSceneNode, deleteSceneNodes} from './mutation/scene-node-mutation';

export default new GraphQLObjectType({
    name: 'Mutation',
    description: '...',

    fields: () => ({
        saveLight,
        deleteLight,
        saveSceneNode,
        deleteSceneNodes
    })
});
