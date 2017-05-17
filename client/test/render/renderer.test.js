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
const Mesh = require('../../main/source/render/mesh');
const Material = require('../../main/source/render/material');
const ProgramData = require('../../main/source/gl/program-data');
const mat4 = require('gl-matrix').mat4;
const assert = require('chai').assert;

describe("render", function() {

    let renderer;
    let mesh;
    let material1, material2;

    beforeEach(function() {
        mesh = new Mesh(null, null, null, null, null, null, []);

        material1 = new Material(new ProgramData(), null);
        material1.getProgramData().setProgram(1);

        material2 = new Material(new ProgramData(), null);
        material2.getProgramData().setProgram(2);
    })


    it("should not call gl.useProgram for a node if last node used same program", function() {
        let numTimesProgramCalled = 0;

        // Override base mock to increment 'numTimesProgramCalled' when gl.useProgram is called
        let modifiedDepsMock = Object.assign({}, baseDepsMock);
        modifiedDepsMock['../gl'].context.useProgram = function() {
            numTimesProgramCalled++;
        }
        renderer = rendererInjector(modifiedDepsMock);

        const root = new SceneNode();
        const node1 = new SceneNode(mat4.create(), mesh, material1);
        const node2 = new SceneNode(mat4.create(), mesh, material1);
        const node3 = new SceneNode(mat4.create(), mesh, material2);
        const node4 = new SceneNode(mat4.create(), mesh, material2);
        root.addChild(node1);
        root.addChild(node2);
        root.addChild(node3);
        root.addChild(node4);

        renderer.render(root);
        assert.equal(numTimesProgramCalled, 2);
    });

});
