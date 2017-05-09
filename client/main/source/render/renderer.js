'use strict';

/* The renderer traverses and renders each node in a scene graph. */

const gl = require('../gl').context;
const camera = require('./camera');
const glMatrix = require('gl-matrix').glMatrix;
const mat4 = require('gl-matrix').mat4;

// The last program used to render a node
let lastProgram = undefined;

function render(sceneNode) {
    initRender();
    renderNode(sceneNode);
}

function initRender() {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 0.85, 0.85, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function renderNode(sceneNode) {
    const mesh = sceneNode.mesh;
    const material = sceneNode.material;

    if (mesh && material) {
        if (material.program !== lastProgram) {
            gl.useProgram(material.program);
            lastProgram = material.program;
        }

        gl.enableVertexAttribArray(material.programAttributes.position);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
        gl.vertexAttribPointer(material.programAttributes.position, mesh.floatsPerVertex,
            gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(material.programAttributes.normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.vertexAttribPointer(material.programAttributes.normal, mesh.floatsPerNormal,
            gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(material.programAttributes.texcoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texcoordBuffer);
        gl.vertexAttribPointer(material.programAttributes.texcoord, mesh.floatsPerTexcoord,
            gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

        gl.uniformMatrix4fv(material.programUniforms.modelMatrix, gl.FALSE, sceneNode.localMatrix);

        gl.uniformMatrix4fv(material.programUniforms.viewMatrix, gl.FALSE, camera.getViewMatrix());

        gl.uniformMatrix4fv(material.programUniforms.projectionMatrix, gl.FALSE,
            mat4.perspective(mat4.create(), glMatrix.toRadian(45.0), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 2500.0));

        gl.bindTexture(gl.TEXTURE_2D, material.texture);

        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    sceneNode.children.forEach(renderNode);
}

module.exports = {
    render: render
}
