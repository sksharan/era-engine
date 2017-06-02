import SceneNode from '../scene-node'
import {mat3, mat4, vec3} from 'gl-matrix'
import {assert} from 'chai'

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
            assert.isTrue(mat3.equals(node.normalMatrix, mat3.create()));
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
        });

        it("should update the child world and normal matrices", function() {
            const root = new SceneNode();

            const localMatrix1 = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 1, 0));
            const node1 = new SceneNode(localMatrix1);

            const localMatrix2 = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 5, 0));
            const node2 = new SceneNode(localMatrix2);

            const localMatrix3 = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 3, 0));
            const node3 = new SceneNode(localMatrix3);

            root.addChild(node1);
            node1.addChild(node2);
            root.addChild(node3);

            // Check world matrices
            assert.isTrue(mat4.exactEquals(root.worldMatrix, mat4.create()));

            assert.isTrue(mat4.exactEquals(node1.worldMatrix,
                mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 1, 0))));

            assert.isTrue(mat4.exactEquals(node2.worldMatrix,
                mat4.fromTranslation(mat4.create(), vec3.fromValues(0, (5+1), 0))));

            assert.isTrue(mat4.exactEquals(node3.worldMatrix,
                mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 3, 0))));

            // Check normal matrices
            assert.isTrue(mat4.exactEquals(root.normalMatrix, mat3.normalFromMat4(mat3.create(), root.worldMatrix)));
            assert.isTrue(mat4.exactEquals(node1.normalMatrix, mat3.normalFromMat4(mat3.create(), node1.worldMatrix)));
            assert.isTrue(mat4.exactEquals(node2.normalMatrix, mat3.normalFromMat4(mat3.create(), node2.worldMatrix)));
            assert.isTrue(mat4.exactEquals(node3.normalMatrix, mat3.normalFromMat4(mat3.create(), node3.worldMatrix)));
        })
    });

});
