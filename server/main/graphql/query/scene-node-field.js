import {
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} from 'graphql'

import {OutputSceneNodeType} from '../type/scene-node-type'
import {getSceneNodes} from '../../service/scene-node-service'

export default {
    type: new GraphQLList(OutputSceneNodeType),
    args: {
        pathRegex: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve(root, args) {
        return getSceneNodes(args.pathRegex);
    }
}
