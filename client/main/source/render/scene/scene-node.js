const mat4 = require('gl-matrix').mat4;

var SceneNode = function() {
    /* Children of this node. */
    this.children = [];

    /* Transformation that defines the position/scale/etc. of this node in
       relation to its parent. */
    this.localMatrix = mat4.identity();

    /* The model matrix for this node; places the object represented by
       this node into the world. */
    this.worldMatrix = mat4.identity();

    /* (Optional) The mesh to render. */
    this.mesh = undefined;
}

SceneNode.prototype.addChild = function(child) {
    this.children.push(child);
}
