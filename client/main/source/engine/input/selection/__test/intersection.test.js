import {assert} from 'chai'
import {mat4, vec3} from 'gl-matrix'
import {testBoundingBoxIntersection} from '../intersection'
import {Ray} from '../ray'
import {BoundingBox} from '../../../mesh/index'
import {GeometryNode, SceneNode} from '../../../node/index'

describe('Bounding box intersection test', () => {
    let node = null;
    before(() => {
        // A 4x4x4 bounding box centered at the origin
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
    it('should account for basic translation', () => {
        const ray = new Ray(vec3.fromValues(0, 5, 0), vec3.fromValues(0, -1, 0));
        node.localMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, 1));
        assert.equal(testBoundingBoxIntersection(ray, node), 3);
        node.localMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, 2));
        assert.equal(testBoundingBoxIntersection(ray, node), 3);
        node.localMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, 3));
        assert.isNull(testBoundingBoxIntersection(ray, node));
    });
    it('should account for basic rotation', () => {
        const ray = new Ray(vec3.fromValues(1.99, 5, 1.99), vec3.fromValues(0, -1, 0));
        node.localMatrix = mat4.fromRotation(mat4.create(), Math.PI/4, vec3.fromValues(0, 1, 0));
        assert.isNull(testBoundingBoxIntersection(ray, node));
        node.localMatrix = mat4.fromRotation(mat4.create(), Math.PI/2, vec3.fromValues(0, 1, 0));
        assert.equal(testBoundingBoxIntersection(ray, node), 3);
        node.localMatrix = mat4.fromRotation(mat4.create(), 3*Math.PI/4, vec3.fromValues(0, 1, 0));
        assert.isNull(testBoundingBoxIntersection(ray, node));
        node.localMatrix = mat4.fromRotation(mat4.create(), Math.PI, vec3.fromValues(0, 1, 0));
        assert.equal(testBoundingBoxIntersection(ray, node), 3);
    });
    it('should account for basic scaling', () => {
        const ray = new Ray(vec3.fromValues(4, 5, 4), vec3.fromValues(0, -1, 0));
        node.localMatrix = mat4.fromScaling(mat4.create(), vec3.fromValues(1, 1, 1));
        assert.isNull(testBoundingBoxIntersection(ray, node));
        node.localMatrix = mat4.fromScaling(mat4.create(), vec3.fromValues(1.5, 1.5, 1.5));
        assert.isNull(testBoundingBoxIntersection(ray, node));
        node.localMatrix = mat4.fromScaling(mat4.create(), vec3.fromValues(2, 1, 2));
        assert.equal(testBoundingBoxIntersection(ray, node), 3);
        node.localMatrix = mat4.fromScaling(mat4.create(), vec3.fromValues(2, 2, 2));
        assert.equal(testBoundingBoxIntersection(ray, node), 1);
    });

    describe('validation', () => {
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
    });
})
