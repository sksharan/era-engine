import {
    GraphQLObjectType
} from 'graphql';

import {
    deleteSceneNodes,
    saveLightSceneNode,
    saveSceneNode,
} from './mutation/scene-node-mutation';

export default new GraphQLObjectType({
    name: 'Mutation',
    description: '...',

    fields: () => ({
        deleteSceneNodes,
        saveLightSceneNode,
        saveSceneNode,
    })
});
