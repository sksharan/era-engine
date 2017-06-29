/* A node in a scene graph. */

import {mat3, mat4} from 'gl-matrix'

function updateWorldMatrix(node, parentWorldMatrix) {
    mat4.multiply(node.worldMatrix, parentWorldMatrix, node.localMatrix);
    mat3.normalFromMat4(node.normalMatrix, node.worldMatrix);

    node.children.forEach(function(child) {
        updateWorldMatrix(child, node.worldMatrix);
    });
}

export default class SceneNode {
    constructor(localMatrix = mat4.create()) {
        this._nodeType = "BASE";
        /* Children of this node. */
        this._children = [];
        /* Transformation that defines the position/scale/etc. of this node in
           relation to its parent. */
        this._localMatrix = localMatrix;
        /* The model matrix for this node; places the object represented by
           this node into the world. */
        this._worldMatrix = mat4.create();
        /* The normal matrix for this node; the inverse-transverse of the world matrix. */
        this._normalMatrix = mat3.create();
    }

    get nodeType() {
        return this._nodeType;
    }

    get children() {
        return this._children;
    }
    get localMatrix() {
        return this._localMatrix;
    }
    get worldMatrix() {
        return this._worldMatrix;
    }
    get normalMatrix() {
        return this._normalMatrix;
    }

    addChild(child) {
        if (child === this) {
            throw new Error("A scene node cannot add itself as a child");
        }
        this._children.push(child);
        updateWorldMatrix(child, this._worldMatrix);
    }
}
