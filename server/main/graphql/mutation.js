import {
    GraphQLObjectType
} from 'graphql';

import {saveLight, deleteLight} from './mutation/light-mutation';
import {
    deleteSceneNodes,
    saveLightSceneNode,
    saveSceneNode,
} from './mutation/scene-node-mutation';

export default new GraphQLObjectType({
    name: 'Mutation',
    description: '...',

    fields: () => ({
        saveLight,
        deleteLight,
        deleteSceneNodes,
        saveLightSceneNode,
        saveSceneNode,
    })
});
