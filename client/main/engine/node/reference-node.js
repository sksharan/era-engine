import {RenderNode} from './render-node';
import {RenderNodeType} from './render-node-type';
import {mat4} from 'gl-matrix';

export class ReferenceNode extends RenderNode {
    constructor({id, localMatrix = mat4.create(), referencedNodeId}) {
        if (!referencedNodeId) {
            throw new TypeError('Reference node ID is required');
        }
        super({id, localMatrix});
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
