'use strict';

const SceneNode = require('../../main/source/render/scene-node');
const mat4 = require('gl-matrix').mat4;
const assert = require('chai').assert;

describe("Scene node", function() {

    describe("creation", function() {
        /* This would the case for the root node of the scene graph which has
         * no associated geometry to render. */
        it("should work with zero constructor arguments", function() {
            const node = new SceneNode();
            assert.isArray(node.children);
            assert.equal(node.children.length, 0);
            assert.isTrue(mat4.equals(node.localMatrix, mat4.create()));
            assert.isTrue(mat4.equals(node.worldMatrix, mat4.create()));
            assert.isUndefined(node.mesh);
            assert.isUndefined(node.material);
        });

        it("should accept a custom local matrix", function() {
            const localMatrix = mat4.add(mat4.create(), mat4.create(), mat4.create());
            const node = new SceneNode(localMatrix);
            assert.isTrue(mat4.equals(node.localMatrix, localMatrix));
        });

        it("should accept a Mesh object", function() {
            const mesh = { /* Mesh properties here */ };
            const node = new SceneNode(mat4.create(), mesh);
            assert.isObject(node.mesh);
            assert.strictEqual(node.mesh, mesh);
            assert.isUndefined(node.material);
        });

        it("should accept a Material object", function() {
            const material = { /* Material properties here */ };
            const node = new SceneNode(mat4.create(), undefined, material);
            assert.isObject(node.material);
            assert.strictEqual(node.material, material);
            assert.isUndefined(node.mesh);
        });
    });

    describe("adding child nodes", function() {
        it("should be successful if the nodes form a valid n-ary tree", function() {
            const node1 = new SceneNode();
            const node2 = new SceneNode();
            const node3 = new SceneNode();
            const node4 = new SceneNode();

            node1.addChild(node2);
            node1.addChild(node3);
            node2.addChild(node4);

            assert.sameMembers(node1.children, [node2, node3]);
            assert.sameMembers(node2.children, [node4]);
            assert.sameMembers(node3.children, []);
            assert.sameMembers(node4.children, []);
        });

        it("should not work if a node tries to add itself as a child", function() {
            const node = new SceneNode();
            assert.throws(function() {node.addChild(node)});
        })
    });

});
