export const SELECT_NODE = "SELECT_NODE";
export const DESELECT_NODE = "DESELECT_NODE";

export const selectNode = (sceneNode, renderNode) => {
    return {
        type: SELECT_NODE,
        payload: {
            sceneNode,
            renderNode,
        }
    }
}

export const deselectNode = (sceneNode, renderNode) => {
    return {
        type: DESELECT_NODE,
        payload: {
            sceneNode,
            renderNode,
        }
    }
}
