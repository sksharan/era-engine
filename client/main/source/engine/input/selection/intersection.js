import {mat4, vec3} from 'gl-matrix'
import {BoundingBox} from '../../mesh/index'
import {GeometryNode} from '../../node/index'

/* Determines if the vector with given origin and direction intersects the given
 * bounding box. Returns the distance from the origin to the intersection point
 * if one exists, otherwise returns null. Uses the algorithm from
 * http://www.opengl-tutorial.org/miscellaneous/clicking-on-objects/picking-with-custom-ray-obb-function/
 */
export const testBoundingBoxIntersection = (origin, direction, boundingBoxNode) => {
    if (!(origin instanceof Float32Array)) {
        throw new TypeError('Origin must be a vec3');
    }
    if (!(direction instanceof Float32Array)) {
        throw new TypeError('Direction must be a vec3');
    }
    if (!(boundingBoxNode instanceof GeometryNode)) {
        throw new TypeError('Node must be a GeometryNode');
    }
    if (!(boundingBoxNode.mesh && boundingBoxNode.mesh instanceof BoundingBox)) {
        throw new TypeError('Node must have a BoundingBox mesh');
    }

    let tMin = 0;
    let tMax = Number.POSITIVE_INFINITY;
    const boundingBoxWorld = mat4.getTranslation(mat4.create(), boundingBoxNode.worldMatrix);
    const delta = mat4.subtract(mat4.create(), boundingBoxWorld, origin);
    let e, f;

    // Test intersection with the 2 planes perpendicular to bounding box x-axis
    const xAxis = vec3.fromValues(boundingBoxNode.worldMatrix[0],
        boundingBoxNode.worldMatrix[1], boundingBoxNode.worldMatrix[2]);
    e = vec3.dot(xAxis, delta);
    f = vec3.dot(direction, xAxis);
    if (Math.abs(f) > 0.001) {
        let t1 = (e + boundingBoxNode.mesh.minX) / f;
        let t2 = (e + boundingBoxNode.mesh.maxX) / f;
        if (t1 > t2) {
            let temp = t1;
            t1 = t2;
            t2 = temp;
        }
        if (t2 < tMax) {
            tMax = t2;
        }
        if (t1 > tMin) {
            tMin = t1;
        }
        if (tMax < tMin) {
            return null;
        }
    } else {
        if (-e + boundingBoxNode.mesh.minX > 0.0 || -e + boundingBoxNode.mesh.maxX < 0.0) {
            return null;
        }
    }
    // Test intersection with the 2 planes perpendicular to bounding box y-axis
    const yAxis = vec3.fromValues(boundingBoxNode.worldMatrix[4],
        boundingBoxNode.worldMatrix[5], boundingBoxNode.worldMatrix[6]);
    e = vec3.dot(yAxis, delta);
    f = vec3.dot(direction, yAxis);
    if (Math.abs(f) > 0.001) {
        let t1 = (e + boundingBoxNode.mesh.minY) / f;
        let t2 = (e + boundingBoxNode.mesh.maxY) / f;
        if (t1 > t2) {
            let temp = t1;
            t1 = t2;
            t2 = temp;
        }
        if (t2 < tMax) {
            tMax = t2;
        }
        if (t1 > tMin) {
            tMin = t1;
        }
        if (tMax < tMin) {
            return null;
        }
    } else {
        if (-e + boundingBoxNode.mesh.minY > 0.0 || -e + boundingBoxNode.mesh.maxY < 0.0) {
            return null;
        }
    }
    // Test intersection with the 2 planes perpendicular to bounding box z-axis
    const zAxis = vec3.fromValues(boundingBoxNode.worldMatrix[8],
        boundingBoxNode.worldMatrix[9], boundingBoxNode.worldMatrix[10]);
    e = vec3.dot(zAxis, delta);
    f = vec3.dot(direction, zAxis);
    if (Math.abs(f) > 0.001) {
        let t1 = (e + boundingBoxNode.mesh.minZ) / f;
        let t2 = (e + boundingBoxNode.mesh.maxZ) / f;
        if (t1 > t2) {
            let temp = t1;
            t1 = t2;
            t2 = temp;
        }
        if (t2 < tMax) {
            tMax = t2;
        }
        if (t1 > tMin) {
            tMin = t1;
        }
        if (tMax < tMin) {
            return null;
        }
    } else {
        if (-e + boundingBoxNode.mesh.minZ > 0.0 || -e + boundingBoxNode.mesh.maxZ < 0.0) {
            return null;
        }
    }
    return tMin; // intersection distance
}
