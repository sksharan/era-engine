export const SELECT_NODE = "SELECT_NODE";

export const selectNode = (sceneNode, renderNode) => {
    return {
        type: SELECT_NODE,
        payload: {
            sceneNode,
            renderNode,
        }
    }
}
