import {mat4, vec3} from 'gl-matrix';
import {Ray} from './ray';
import {BoundingBox} from '../../mesh/index';
import {GeometryNode} from '../../node/index';

/* Determines if the ray intersects the given bounding box. Returns the distance from
 * the origin to the intersection point if one exists, otherwise returns null.
 * Uses the algorithm from Real-Time Rendering, Third Edition and
 * http://www.opengl-tutorial.org/miscellaneous/clicking-on-objects/picking-with-custom-ray-obb-function/
 */
export const testBoundingBoxIntersection = (ray, boundingBoxNode) => {
    validateArgs(ray, boundingBoxNode);

    const scaling = mat4.getScaling(vec3.create(), boundingBoxNode.worldMatrix);
    const x = {
        halfLength: scaling[0] * Math.abs((boundingBoxNode.mesh.maxX - boundingBoxNode.mesh.minX) / 2),
        axis: vec3.fromValues(
            boundingBoxNode.worldMatrix[0],
            boundingBoxNode.worldMatrix[1],
            boundingBoxNode.worldMatrix[2]
        )
    };
    const y = {
        halfLength: scaling[1] * Math.abs((boundingBoxNode.mesh.maxY - boundingBoxNode.mesh.minY) / 2),
        axis: vec3.fromValues(
            boundingBoxNode.worldMatrix[4],
            boundingBoxNode.worldMatrix[5],
            boundingBoxNode.worldMatrix[6]
        )
    };
    const z = {
        halfLength: scaling[2] * Math.abs((boundingBoxNode.mesh.maxZ - boundingBoxNode.mesh.minZ) / 2),
        axis: vec3.fromValues(
            boundingBoxNode.worldMatrix[8],
            boundingBoxNode.worldMatrix[9],
            boundingBoxNode.worldMatrix[10]
        )
    };
    const boxCenterPositionWorld = vec3.fromValues(
        (boundingBoxNode.mesh.minX + boundingBoxNode.mesh.maxX) / 2,
        (boundingBoxNode.mesh.minY + boundingBoxNode.mesh.maxY) / 2,
        (boundingBoxNode.mesh.minZ + boundingBoxNode.mesh.maxZ) / 2
    );
    vec3.transformMat4(boxCenterPositionWorld, boxCenterPositionWorld, boundingBoxNode.worldMatrix);
    const delta = vec3.subtract(vec3.create(), boxCenterPositionWorld, ray.origin);

    let tMin = Number.NEGATIVE_INFINITY;
    let tMax = Number.POSITIVE_INFINITY;
    const epsilon = 0.00001;

    for (let {halfLength, axis} of [x, y, z]) {
        axis = vec3.normalize(vec3.create(), axis);
        let e = vec3.dot(axis, delta);
        let f = vec3.dot(axis, ray.direction);
        if (Math.abs(f) > epsilon) {
            let t1 = (e + halfLength) / f;
            let t2 = (e - halfLength) / f;
            if (t1 > t2) {
                let temp = t1;
                t1 = t2;
                t2 = temp;
            }
            if (t1 > tMin) {
                tMin = t1;
            }
            if (t2 < tMax) {
                tMax = t2;
            }
            if (tMin > tMax) {
                return null;
            }
            if (tMax < 0) {
                return null;
            }
        } else {
            if (-e - halfLength > 0 || -e + halfLength < 0) {
                return null;
            }
        }
    }
    return tMin;
};

function validateArgs(ray, boundingBoxNode) {
    if (!(ray instanceof Ray)) {
        throw new TypeError('Must specify a valid Ray');
    }
    if (!(boundingBoxNode instanceof GeometryNode)) {
        throw new TypeError('Node must be a GeometryNode');
    }
    if (!(boundingBoxNode.mesh && boundingBoxNode.mesh instanceof BoundingBox)) {
        throw new TypeError('Node must have a BoundingBox mesh');
    }
}
