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
        /* Parent of this node - scene nodes have at most one parent. */
        this._parent = null;
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

        /* Total amount of translation, scaling, rotation currently applied. */
        this._translate = mat4.create();
        this._scale = mat4.create();
        this._rotate = mat4.create();
    }

    get nodeType() {
        return this._nodeType;
    }
    get parent() {
        return this._parent;
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

    // Set the local matrix directly
    set localMatrix(localMatrix) {
        this._localMatrix = localMatrix;
        if (this._parent) {
            updateWorldMatrix(this, this._parent._worldMatrix);
        }
    }
    // Change the local matrix indirectly by applying translation, scaling, rotation
    applyTranslation(translation) {
        this._translate = mat4.mul(mat4.create(), this._translate, translation);
        this._updateLocalMatrix();
    }
    applyScaling(scaling) {
        this._scale = mat4.mul(mat4.create(), this._scale, scaling);
        this._updateLocalMatrix();
    }
    applyRotation(rotation) {
        this._rotate = mat4.mul(mat4.create(), rotation, this._rotate);
        this._updateLocalMatrix();
    }
    _updateLocalMatrix() {
        this.localMatrix = mat4.mul(
            mat4.create(),
            this._translate,
            mat4.mul(mat4.create(), this._scale, this._rotate)
        );
    }

    addChild(child) {
        if (child === this) {
            throw new Error("A scene node cannot add itself as a child");
        }
        if (child._parent !== null) {
            throw new Error("The child node already has a parent");
        }
        child._parent = this;
        this._children.push(child);
        updateWorldMatrix(child, this._worldMatrix);
    }

    removeAllChildren() {
        for (let child of this._children) {
            child._parent = null;
        }
        this._children = [];
    }

    removeParent() {
        if (this._parent === null) {
            throw new Error("Node does not have a parent");
        }

        const childIndex = this._parent.children.indexOf(this);
        if (childIndex === -1) {
            throw new Error("Parent does not have this node as a child");
        }
        this._parent.children.splice(childIndex, 1);
        this._parent = null;
    }
}
