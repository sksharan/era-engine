import {ReferenceNodeCache} from '../node/index'
import {
    Store,
    selectNode,
    deselectNode,
} from '../../interface/index'

// Provide a callback that takes the selected node as the only argument
export const subscribeToNodeSelectedEvent = (callback) => {
    Store.subscribe(() => {
        const {selectedNode} = Store.getState()['common.selection'];
        if (selectedNode) {
            callback(selectedNode.renderNode);
        }
    });
}

export const triggerNodeSelectedEvent = (selectedRenderNode) => {
    actOnRenderNode(selectedRenderNode,
        (sceneNode, renderNode) => {
            Store.dispatch(selectNode(sceneNode, renderNode));
        });
}
export const triggerNodeDeselectedEvent = (deselectedRenderNode) => {
    actOnRenderNode(deselectedRenderNode,
        (sceneNode, renderNode) => {
            Store.dispatch(deselectNode(sceneNode, renderNode));
        });
}
function actOnRenderNode(renderNode, func) {
    const sceneNodes = Store.getState()['common.nodes'].nodeArray;
    if (!sceneNodes) {
        return;
    }
    for (const sceneNode of sceneNodes) {
        if (sceneNode.type === 'REFERENCE') {
            if (ReferenceNodeCache.hasReference({referenceId: sceneNode.content.sceneNodeId})) {
                const {sceneNodes, renderNodes} = ReferenceNodeCache.getReference({
                    referenceId: sceneNode.content.sceneNodeId
                });
                for (let i = 0; i < renderNodes.length; i++) {
                    if (renderNodes[i].id === renderNode.id) {
                        func(sceneNodes[i], renderNodes[i]);
                    }
                }
            }
        } else {
            // TODO: what to do when scene node is not a reference?
        }
    }
}
