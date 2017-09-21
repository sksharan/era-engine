import {assert} from 'chai'
import {mat4, vec3} from 'gl-matrix'
import {testBoundingBoxIntersection} from '../intersection'
import {Ray} from '../ray'
import {BoundingBox} from '../../../mesh/index'
import {GeometryNode, SceneNode} from '../../../node/index'

describe('Bounding box intersection test', () => {
    let node = null;
    before(() => {
        // A 4x4 bounding box centered at the origin
        node = new GeometryNode(mat4.create(), {
            mesh: new BoundingBox([-2, -2, -2, 2, 2, 2]),
            material: null
        });
    });
    it('should return distance if ray intersects bounding box', () => {
        assert.equal(testBoundingBoxIntersection(
            new Ray(vec3.fromValues(0, 5, 0), vec3.fromValues(0, -1, 0)), node), 3);
        assert.equal(testBoundingBoxIntersection(
            new Ray(vec3.fromValues(2, 10, 2), vec3.fromValues(0, -1, 0)), node), 8);
    });
    it('should return null if ray does not intersect bounding box', () => {
        assert.isNull(testBoundingBoxIntersection(
            new Ray(vec3.fromValues(0, 5, 3), vec3.fromValues(0, -1, 0)), node));
    });
    it('should validate ray type', () => {
        assert.throws(() => testBoundingBoxIntersection('bad ray', node), 'Must specify a valid Ray');
    });
    it('should validate bounding box node type', () => {
        assert.throws(() => testBoundingBoxIntersection(new Ray(vec3.create(), vec3.create()),
            new SceneNode()), 'Node must be a GeometryNode');
    });
    it('should validate bounding box node mesh type', () => {
        node =  new GeometryNode(mat4.create(), {
            mesh: new SceneNode(),
            material: null
        });
        assert.throws(() => testBoundingBoxIntersection(new Ray(vec3.create(), vec3.create()), node),
                'Node must have a BoundingBox mesh');
    });
})
