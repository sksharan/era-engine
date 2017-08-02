import {
    GraphQLNonNull,
    GraphQLList,
    GraphQLString
} from 'graphql'

import {InputSceneNodeType, OutputSceneNodeType} from '../type/scene-node-type'
import * as SceneNodeService from '../../service/scene-node-service'

export const saveSceneNode = {
    type: OutputSceneNodeType,
    args: {
        sceneNode: {
            type: new GraphQLNonNull(InputSceneNodeType)
        }
    },
    resolve: (root, args) => {
        if (args.sceneNode.localMatrix.length !== 16) {
            throw new Error('Local matrix must be a list of exactly 16 elements')
        }
        return SceneNodeService.saveSceneNode(args.sceneNode);
    }
}

export const deleteSceneNodes = {
    type: new GraphQLList(OutputSceneNodeType), // The deleted nodes
    args: {
        pathRegex: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (root, args) => {
        return SceneNodeService.deleteSceneNodes(args.pathRegex);
    }
}
