import {Camera, getDefaultPerspectiveMatrixInverse} from '../camera/index'
import {NodeAnalyzer} from '../node/index'
import {RootSceneNode} from '../index'
import {gl} from '../gl'
import {mat4, vec3, vec4} from 'gl-matrix'

const nodeAnalyzer = new NodeAnalyzer();

// http://antongerdelan.net/opengl/raycasting.html
export const getWorldSpaceRay = (mouseX, mouseY) => {
    // Convert to normalized device space
    const ndsX = (2.0 * mouseX) / gl.canvas.clientWidth - 1.0;
    const ndsY = 1.0 - (2.0 * mouseY) / gl.canvas.clientHeight;

    // Convert to homogenous clip space
    const rayClip = vec4.fromValues(ndsX, ndsY, -1.0, 1.0);

    // Convert to eye space
    let rayEye = vec4.transformMat4(vec4.create(), rayClip, getDefaultPerspectiveMatrixInverse());
    rayEye = vec4.fromValues(rayEye[0], rayEye[1], -1.0, 0.0);

    // Convert to world space
    let rayWorld = vec4.transformMat4(vec4.create(), rayEye, Camera.getViewMatrixInverse());
    return vec4.normalize(vec4.create(), rayWorld);
}

export const testBoundingBoxIntersections = (rayOrigin, rayDirection) => {
    nodeAnalyzer.analyze(RootSceneNode);

    let closestSelectedNode = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let boundingBoxNode of nodeAnalyzer.getAllBoundingBoxNodes()) {
        let distance = testBoundingBoxIntersection(rayOrigin, rayDirection, boundingBoxNode);
        if (distance && distance < closestDistance) {
            closestSelectedNode = boundingBoxNode;
        }
    }
    clearSelection(RootSceneNode);
    if (closestSelectedNode) {
        selectObject(closestSelectedNode);
    }
}

// http://www.opengl-tutorial.org/miscellaneous/clicking-on-objects/picking-with-custom-ray-obb-function/
function testBoundingBoxIntersection(rayOrigin, rayDirection, boundingBoxNode) {
    let tMin = 0;
    let tMax = Number.POSITIVE_INFINITY;
    const boundingBoxWorld = mat4.getTranslation(mat4.create(), boundingBoxNode.worldMatrix);
    const delta = mat4.subtract(mat4.create(), boundingBoxWorld, rayOrigin);

    let e, f;

    // Test intersection with the 2 planes perpendicular to bounding box x-axis
    const xAxis = vec3.fromValues(boundingBoxNode.worldMatrix[0],
        boundingBoxNode.worldMatrix[1], boundingBoxNode.worldMatrix[2]);
    e = vec3.dot(xAxis, delta);
    f = vec3.dot(rayDirection, xAxis);
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
    f = vec3.dot(rayDirection, yAxis);
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
    f = vec3.dot(rayDirection, zAxis);
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

function clearSelection(node) {
    colorGeometryNodes(node, vec4.fromValues(0, 0, 0, 0));
}

function selectObject(boundingBoxNode) {
    let currNode = boundingBoxNode;
    // Find the topmost node of the object which is a default (non-geometric) scene node
    while (currNode.nodeType !== "BASE") {
        currNode = currNode.parent;
    }
    colorGeometryNodes(currNode, vec4.fromValues(0.15, 0.15, 0.15, 0));
}

function colorGeometryNodes(node, color) {
    if (node.nodeType === "GEOMETRY") {
        node.material.color = color;
    }
    if (node.children) {
        node.children.forEach((child) => colorGeometryNodes(child, color));
    }
}

