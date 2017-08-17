import {
    GraphQLObjectType
} from 'graphql';

import {
    deleteSceneNodes,
    saveLightSceneNode,
    saveObjectRefSceneNode,
    saveSceneNode,
} from './mutation/scene-node-mutation';

export default new GraphQLObjectType({
    name: 'Mutation',
    description: '...',

    fields: () => ({
        deleteSceneNodes,
        saveLightSceneNode,
        saveObjectRefSceneNode,
        saveSceneNode,
    })
});
