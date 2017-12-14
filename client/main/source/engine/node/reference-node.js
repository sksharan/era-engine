import SceneNode from './scene-node'
import {SceneNodeType} from './scene-node-type'

export class ReferenceNode extends SceneNode {
    constructor(localMatrix, referencedNodeId) {
        super(localMatrix);
        this._nodeType = SceneNodeType.REFERENCE;
        this._referencedNodeId = referencedNodeId;
    }

    get referencedNodeId() {
        return this._referencedNodeId;
    }

    set referencedNodeId(referencedNodeId) {
        this._referencedNodeId = referencedNodeId;
    }
}
