import {assert} from 'chai'
import {findNearestBaseNodeForBoundingBoxNode} from '../node-finder'
import {GeometryNode, SceneNode} from '../../../node/index'
import {BoundingBox} from '../../../mesh/index'
import {mat4} from 'gl-matrix'

describe('Node finder', () => {
    describe('find nearest base node for bounding box node', () => {
        it('should verify that node is GeometryNode', () => {
            assert.throws(() => findNearestBaseNodeForBoundingBoxNode(new SceneNode(),
                'Node must be a GeometryNode'));
        });
        it('should find nearest parent', () => {
            const ancestor = new SceneNode();
            const parent = new SceneNode();
            const child1 = new GeometryNode(mat4.create(), {
                mesh: new BoundingBox([-2, -2, -2, 2, 2, 2]),
                material: null
            });
            const child2 = new SceneNode();

            ancestor.addChild(parent);
            parent.addChild(child1);
            parent.addChild(child2);

            assert.equal(findNearestBaseNodeForBoundingBoxNode(child1), parent);
        })
    });
});
