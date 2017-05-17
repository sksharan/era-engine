'use strict';

let baseDepsMock = {
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
            useProgram: function() {},
            vertexAttribPointer: function() {},
            viewport: function() {}
        }
    }
}

const rendererInjector = require('inject-loader!../../main/source/render/renderer');
const SceneNode = require('../../main/source/render/scene-node');
const ProgramData = require('../../main/source/gl/program-data');
const mat4 = require('gl-matrix').mat4;
const assert = require('chai').assert;

describe("render", function() {

    let renderer;
    let mockMesh;
    let mockMaterial1, mockMaterial2;

    beforeEach(function() {
        mockMesh = {
            indices: []
        };

        mockMaterial1 = {
            programData: new ProgramData()
        };
        mockMaterial1.programData.setProgram(1);

        mockMaterial2 = {
            programData: new ProgramData()
        };
        mockMaterial2.programData.setProgram(2);
    })


    it("should not call gl.useProgram for a node if last node used same program", function() {
        let numTimesProgramCalled = 0;

        // Override base mock to increment 'numTimesProgramCalled' when gl.useProgram is called
        let modifiedDepsMock = Object.assign({}, baseDepsMock);
        modifiedDepsMock['../gl'].context.useProgram = function() {
            numTimesProgramCalled++;
        }
        renderer = rendererInjector(modifiedDepsMock);

        const material1 = mockMaterial1;
        const material2 = mockMaterial2;

        const root = new SceneNode();
        const node1 = new SceneNode(mat4.create(), mockMesh, material1);
        const node2 = new SceneNode(mat4.create(), mockMesh, material1);
        const node3 = new SceneNode(mat4.create(), mockMesh, material2);
        const node4 = new SceneNode(mat4.create(), mockMesh, material2);
        root.addChild(node1);
        root.addChild(node2);
        root.addChild(node3);
        root.addChild(node4);

        renderer.render(root);
        assert.equal(numTimesProgramCalled, 2);
    });

});
