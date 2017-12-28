import {RenderNode} from './render-node'
import {RenderNodeType} from './render-node-type'

export class ReferenceNode extends RenderNode {
    constructor(localMatrix, referencedNodeId) {
        super(localMatrix);
        this._nodeType = RenderNodeType.REFERENCE;
        this._referencedNodeId = referencedNodeId;
    }

    get referencedNodeId() {
        return this._referencedNodeId;
    }

    set referencedNodeId(referencedNodeId) {
        this._referencedNodeId = referencedNodeId;
    }
}
