import * as SceneNodeDao from '../dao/scene-node-dao'

export const getSceneNode = (id) => {
    return SceneNodeDao.getSceneNode(id);
}

export const getSceneNodes = (pathRegex) => {
    return SceneNodeDao.getSceneNodes(new RegExp(pathRegex));
}

export const saveSceneNode = (sceneNode) => {
    return SceneNodeDao.saveSceneNode(sceneNode);
}

export const deleteSceneNodes = (pathRegex) => {
    return SceneNodeDao.deleteSceneNodes(new RegExp(pathRegex));
}
