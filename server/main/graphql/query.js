import {
    GraphQLObjectType
} from 'graphql';

import SceneNodeField from './query/scene-node-field';

export default new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
        sceneNodes: SceneNodeField
    })
});
