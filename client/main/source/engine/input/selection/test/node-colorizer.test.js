import {assert} from 'chai'
import {colorGeometryNodes} from '../node-colorizer'
import {GeometryNode, SceneNode} from '../../../node/index'
import {BoundingBox} from '../../../mesh/index'
import {Material} from '../../../material/index'
import {mat4, vec3} from 'gl-matrix'

describe('Node colorizer', () => {
    describe('for geometry nodes', () => {
        it('should verify node is GeometryNode', () => {
            assert.throws(() => colorGeometryNodes('bad scene node', vec3.create()),
                'Node must be a SceneNode');
        });
        it('should color all geometry nodes', () => {
            const node1 = new SceneNode();
            const node2 = new GeometryNode(mat4.create(), {
                mesh: new BoundingBox([0, 0, 0, 0, 0, 0]),
                material: new Material()
            });
            const node3 = new SceneNode();
            const node4 = new GeometryNode(mat4.create(), {
                mesh: new BoundingBox([0, 0, 0, 0, 0, 0]),
                material: new Material()
            });
            const node5 = new GeometryNode(mat4.create(), {
                mesh: new BoundingBox([0, 0, 0, 0, 0, 0]),
                material: new Material()
            });
            node1.addChild(node2);
            node2.addChild(node3);
            node3.addChild(node4);
            node3.addChild(node5);

            const defaultColor = vec3.create();
            const newColor = vec3.create(0.1, 0.2, 0.3);

            assert.isTrue(vec3.equals(defaultColor, node2.material.color));
            assert.isTrue(vec3.equals(defaultColor, node4.material.color));
            assert.isTrue(vec3.equals(defaultColor, node5.material.color));
            colorGeometryNodes(node1, newColor);
            assert.isTrue(vec3.equals(newColor, node2.material.color));
            assert.isTrue(vec3.equals(newColor, node4.material.color));
            assert.isTrue(vec3.equals(newColor, node5.material.color));
        });
    });
});
