'use strict';

let numTimesProgramCalled = 0;

/* Setup renderer with mocks */
const rendererInjector = require('inject-loader!../../main/source/render/renderer');
const renderer = rendererInjector({
    '../gl': {
        context: {
            canvas: { width: 0, height: 0 },
            bindBuffer: function() {},
            bindTexture: function() {},
            clear: function() {},
            clearColor: function() {},
            cullFace: function() {},
            depthFunc: function() {},
            drawElements: function() {},
            enable: function() {},
            enableVertexAttribArray: function() {},
            frontFace: function() {},
            uniform3fv: function() {},
            uniformMatrix3fv: function() {},
            uniformMatrix4fv: function() {},
            useProgram: function() { numTimesProgramCalled++; },
            vertexAttribPointer: function() {},
            viewport: function() {}
        }
    }
});

function getMockMesh() {
    return {
        indices: []
    };
}
function getMockMaterial() {
    return {
        program: 0,
        programAttributes: {},
        programUniforms: {}
    }
}

const SceneNode = require('../../main/source/render/scene-node');
const mat4 = require('gl-matrix').mat4;
const assert = require('chai').assert;

describe("render", function() {

    it("should not call gl.useProgram for a node if last node used same program", function() {
        numTimesProgramCalled = 0;

        const material1 = getMockMaterial();
        const material2 = getMockMaterial();
        material2.program = 1;

        const root = new SceneNode();
        const node1 = new SceneNode(mat4.create(), getMockMesh(), material1);
        const node2 = new SceneNode(mat4.create(), getMockMesh(), material1);
        const node3 = new SceneNode(mat4.create(), getMockMesh(), material2);
        const node4 = new SceneNode(mat4.create(), getMockMesh(), material2);
        root.addChild(node1);
        root.addChild(node2);
        root.addChild(node3);
        root.addChild(node4);

        renderer.render(root);
        assert.equal(numTimesProgramCalled, 2);
    });

});
