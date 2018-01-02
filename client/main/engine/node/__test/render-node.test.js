import {RenderNode} from '../render-node'
import {mat3, mat4, vec3} from 'gl-matrix'
import {assert} from 'chai'

describe("Scene node", () => {

    describe("creation", () => {

        it("should work with zero constructor arguments", () => {
            const node = new RenderNode();
            assert.isArray(node.children);
            assert.equal(node.children.length, 0);
            assert.isTrue(mat4.equals(node.localMatrix, mat4.create()));
            assert.isTrue(mat4.equals(node.worldMatrix, mat4.create()));
            assert.isTrue(mat3.equals(node.normalMatrix, mat3.create()));
        });

        it("should accept a custom local matrix", () => {
            const localMatrix = mat4.add(mat4.create(), mat4.create(), mat4.create());
            const node = new RenderNode({localMatrix});
            assert.isTrue(mat4.equals(node.localMatrix, localMatrix));
        });

    });

    describe("adding child nodes", () => {
        it("should be successful if the nodes form a valid n-ary tree", () => {
            const node1 = new RenderNode();
            const node2 = new RenderNode();
            const node3 = new RenderNode();
            const node4 = new RenderNode();

            node1.addChild(node2);
            node1.addChild(node3);
            node2.addChild(node4);

            assert.sameMembers(node1.children, [node2, node3]);
            assert.sameMembers(node2.children, [node4]);
            assert.sameMembers(node3.children, []);
            assert.sameMembers(node4.children, []);
        });

        it("should fail if a node tries to add itself as a child", () => {
            const node = new RenderNode();
            assert.throws(() => node.addChild(node));
        });

        it("should fail if the child already has a parent", () => {
            const parent1 = new RenderNode();
            const parent2 = new RenderNode();
            const child = new RenderNode();
            parent1.addChild(child);
            assert.throws(() => parent2.addChild(child));
        });

        it("should update the child world and normal matrices", () => {
            const root = new RenderNode();

            const localMatrix1 = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 1, 0));
            const node1 = new RenderNode({localMatrix: localMatrix1});

            const localMatrix2 = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 5, 0));
            const node2 = new RenderNode({localMatrix: localMatrix2});

            const localMatrix3 = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 3, 0));
            const node3 = new RenderNode({localMatrix: localMatrix3});

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

    describe('removing all children', () => {

        it('should be successful', () => {
            const parent = new RenderNode();
            const child1 = new RenderNode();
            const child2 = new RenderNode();

            parent.addChild(child1);
            parent.addChild(child2);
            assert.equal(parent.children.length, 2);

            parent.removeAllChildren();
            assert.equal(parent.children.length, 0);

            // Should be able to insert children
            parent.addChild(child1);
            parent.addChild(child2);
            assert.equal(parent.children.length, 2);
        });

    });

    describe('removing parent node', () => {

        it('should be successful if node has a parent', () => {
            const parent = new RenderNode();
            const child = new RenderNode();

            assert.equal(parent.children.length, 0);

            parent.addChild(child);
            assert.equal(parent.children.length, 1);

            child.removeParent();
            assert.equal(parent.children.length, 0);
        });

        it('should fail if the node does not have a parent', () => {
            assert.throws(() => new RenderNode().removeParent());
        })

    });

});
