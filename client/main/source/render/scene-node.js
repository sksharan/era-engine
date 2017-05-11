'use strict';

/* A node in a scene graph. */

const mat4 = require('gl-matrix').mat4;

var SceneNode = function(localMatrix, mesh, material) {
    /* Children of this node. */
    this.children = [];

    /* Transformation that defines the position/scale/etc. of this node in
       relation to its parent. */
    this.localMatrix = (typeof localMatrix != 'undefined') ? localMatrix : mat4.create();

    /* The model matrix for this node; places the object represented by
       this node into the world. */
    this.worldMatrix = mat4.create();

    /* (Optional) The mesh to render. */
    this.mesh = mesh;

    /* (Optional) The material to associate with the mesh. */
    this.material = material;
}

SceneNode.prototype.addChild = function(child) {
    if (child === this) {
        throw new Error("A scene node cannot add itself as a child");
    }
    this.children.push(child);
    updateWorldMatrix(child, this.worldMatrix);
}

function updateWorldMatrix(node, parentWorldMatrix) {
    node.worldMatrix = mat4.multiply(mat4.create(), parentWorldMatrix, node.localMatrix);
    node.children.forEach(function(child) {
        updateWorldMatrix(child, node.worldMatrix);
    });
}

module.exports = SceneNode;
