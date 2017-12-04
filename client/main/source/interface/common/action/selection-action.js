export const SELECT_SCENE_NODE = "SELECT_SCENE_NODE";

export const selectSceneNode = (sceneNode) => {
    return {
        type: SELECT_SCENE_NODE,
        payload: sceneNode
    }
}
