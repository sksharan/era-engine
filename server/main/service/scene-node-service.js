import * as SceneNodeDao from '../dao/scene-node-dao'

export const getSceneNodes = (pathRegex) => {
    return SceneNodeDao.getSceneNodes(new RegExp(pathRegex));
}

export const saveSceneNode = (sceneNode, content) => {
    sceneNode.content = content;
    return SceneNodeDao.saveSceneNode(sceneNode);
}

export const deleteSceneNodes = (pathRegex) => {
    return SceneNodeDao.deleteSceneNodes(new RegExp(pathRegex));
}
