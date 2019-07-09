import {mat3, mat4, vec3} from 'gl-matrix';
import {CurrentTransformOrientation} from '../global/index';
import {RenderNodeType} from './render-node-type';

function updateWorldMatrix(node, parentWorldMatrix) {
    mat4.multiply(node.worldMatrix, parentWorldMatrix, node.localMatrix);
    mat3.normalFromMat4(node.normalMatrix, node.worldMatrix);

    node.children.forEach(function(child) {
        updateWorldMatrix(child, node.worldMatrix);
    });
}

export class RenderNode {
    constructor({id = null, localMatrix = mat4.create()} = {}) {
        /* An optional ID for this node. */
        this._id = id;
        /* Type of node - subclasses of this class will use different node types. */
        this._nodeType = RenderNodeType.BASE;
        /* Parent of this node - render nodes have at most one parent. */
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
    }

    get id() {
        return this._id;
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

    set localMatrix(localMatrix) {
        this._localMatrix = localMatrix;
        if (this._parent) {
            updateWorldMatrix(this, this._parent._worldMatrix);
        } else {
            updateWorldMatrix(this, mat4.create());
        }
    }
    applyTranslation(translationMatrix) {
        if (CurrentTransformOrientation.isGlobal()) {
            this.localMatrix = mat4.mul(this._localMatrix, translationMatrix, this._localMatrix);
        } else if (CurrentTransformOrientation.isLocal()) {
            this.localMatrix = mat4.mul(this._localMatrix, this._localMatrix, translationMatrix);
        }
    }
    applyScaling(scalingMatrix) {
        if (CurrentTransformOrientation.isGlobal()) {
            this._transformAtOrigin(mat => {
                mat4.mul(mat, scalingMatrix, mat);
            });
        } else if (CurrentTransformOrientation.isLocal()) {
            this._transformAtOrigin(mat => {
                mat4.mul(mat, mat, scalingMatrix);
            });
        }
    }
    applyRotation(rotationMatrix) {
        // Rely on the caller to provide a rotation matrix that uses the correct global or local axis
        this._transformAtOrigin(mat => {
            mat4.mul(mat, rotationMatrix, mat);
        });
    }
    _transformAtOrigin(originFunction) {
        const currMatrix = mat4.copy(mat4.create(), this._localMatrix);
        const translationVector = mat4.getTranslation(vec3.create(), currMatrix);

        // Translate to origin
        currMatrix[12] = 0;
        currMatrix[13] = 0;
        currMatrix[14] = 0;
        // Apply transformation at origin
        originFunction(currMatrix);
        // Translate back to original position
        currMatrix[12] = translationVector[0];
        currMatrix[13] = translationVector[1];
        currMatrix[14] = translationVector[2];

        this.localMatrix = currMatrix;
    }

    addChild(child) {
        if (child === this) {
            throw new Error('A render node cannot add itself as a child');
        }
        if (child._parent !== null) {
            throw new Error('The child node already has a parent');
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
            throw new Error('Node does not have a parent');
        }

        const childIndex = this._parent.children.indexOf(this);
        if (childIndex === -1) {
            throw new Error('Parent does not have this node as a child');
        }
        this._parent.children.splice(childIndex, 1);
        this._parent = null;
    }
}
