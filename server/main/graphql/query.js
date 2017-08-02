import {
    GraphQLObjectType
} from 'graphql';

import LightField from './query/light-field';
import SceneNodeField from './query/scene-node-field';

export default new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
        light: LightField,
        sceneNodes: SceneNodeField
    })
});
