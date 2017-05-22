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
    constructor(localMatrix, mesh, material) {
        /* Children of this node. */
        this.children = [];

        /* Transformation that defines the position/scale/etc. of this node in
           relation to its parent. */
        this.localMatrix = (localMatrix === null || localMatrix === undefined) ? mat4.create() : localMatrix;

        /* The model matrix for this node; places the object represented by
           this node into the world. */
        this.worldMatrix = mat4.create();

        /* The normal matrix for this node; the inverse-transverse of the world matrix. */
        this.normalMatrix = mat3.create();

        /* (Optional) The mesh to render. */
        this.mesh = mesh;

        /* (Optional) The material to associate with the mesh. */
        this.material = material;
    }

    getChildren() {
        return this.children;
    }

    getLocalMatrix() {
        return this.localMatrix;
    }

    getWorldMatrix() {
        return this.worldMatrix;
    }

    getNormalMatrix() {
        return this.normalMatrix;
    }

    hasMesh() {
        return this.mesh !== undefined && this.mesh !== null;
    }

    getMesh() {
        return this.mesh;
    }

    hasMaterial() {
        return this.material !== undefined && this.material !== null;
    }

    getMaterial() {
        return this.material;
    }

    addChild(child) {
        if (child === this) {
            throw new Error("A scene node cannot add itself as a child");
        }
        this.children.push(child);
        updateWorldMatrix(child, this.worldMatrix);
    }
}
