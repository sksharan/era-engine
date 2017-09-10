import {Camera, getDefaultPerspectiveMatrixInverse} from '../camera/index'
import {
    NodeAnalyzer,
    TransformMesh,
    TranslateXMesh,
    TranslateYMesh,
    TranslateZMesh,
    createTranslateNode
} from '../node/index'
import {RootSceneNode} from '../index'
import {gl} from '../gl'
import {mat4, vec3, vec4} from 'gl-matrix'

const nodeAnalyzer = new NodeAnalyzer();

let currSelectedObjectBase = null;
let currTransformNode = null;
let lastIntersection = null;
let transformBoundingPlane = null;
let transformBoundingBoxNode = null;
let allowTransformBoundingReset = false;

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

export const clear = () => {
    lastIntersection = null;
    if (allowTransformBoundingReset) {
        transformBoundingPlane = null;
        transformBoundingBoxNode = null;
    }
}

export const testBoundingBoxIntersections = ({rayOrigin, rayDirection, transformationOnly}) => {
    nodeAnalyzer.analyze(RootSceneNode);
    const boundingBoxNodes = nodeAnalyzer.getAllBoundingBoxNodes();
    if (transformBoundingPlane) {
        boundingBoxNodes.push(transformBoundingPlane);
    }

    let closestSelectedNode = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let boundingBoxNode of boundingBoxNodes) {
        let distance = testBoundingBoxIntersection(rayOrigin, rayDirection, boundingBoxNode);
        if (!distance) {
            continue; // No intersection with this bounding box
        }
        if (transformBoundingPlane && boundingBoxNode === transformBoundingPlane) {
            const intersection = getIntersection(rayOrigin, rayDirection, distance);
            handleTransformationSelection(transformBoundingBoxNode, intersection);
            lastIntersection = intersection;
            allowTransformBoundingReset = true;
        }
        if (transformBoundingPlane && boundingBoxNode !== transformBoundingPlane) {
            continue;
        }
        if (boundingBoxNode === transformBoundingPlane || boundingBoxNode.parent.mesh instanceof TransformMesh) { // Transformation special case
            const intersection = getIntersection(rayOrigin, rayDirection, distance);
            handleTransformationSelection(boundingBoxNode, intersection);
            lastIntersection = intersection;
            return;
        }
        if (distance < closestDistance) {
            closestDistance = distance;
            closestSelectedNode = boundingBoxNode;
        }
    }

    if (transformationOnly) {
        return; // No transformation node selected, nothing left to do
    }

    colorGeometryNodes(RootSceneNode, vec4.fromValues(0, 0, 0, 0));
    if (closestSelectedNode) {
        let selectedObjectBase = getSelectedObjectBase(closestSelectedNode);
        colorGeometryNodes(selectedObjectBase, vec4.fromValues(0.15, 0.15, 0.15, 0));

        if (selectedObjectBase !== currSelectedObjectBase) {
            clearSelection();
            currTransformNode = createTranslateNode();
            selectedObjectBase.addChild(currTransformNode);
            currSelectedObjectBase = selectedObjectBase;
        }
        lastIntersection = getIntersection(rayOrigin, rayDirection, closestDistance);
    } else {
        clearSelection();
        lastIntersection = null;
        transformBoundingPlane = null;
        transformBoundingBoxNode = null;
    }
}

function getIntersection(origin, direction, distance) {
    return vec3.add(vec3.create(), origin, vec3.scale(vec3.create(), direction, distance));
}

function clearSelection() {
    if (currTransformNode) {
        currTransformNode.removeParent();
    }
    currTransformNode = null;
    currSelectedObjectBase = null;
}

function getSelectedObjectBase(boundingBoxNode) {
    let currNode = boundingBoxNode;
    while (currNode.nodeType !== "BASE") {
        currNode = currNode.parent;
    }
    return currNode;
}

function colorGeometryNodes(node, color) {
    if (node.nodeType === "GEOMETRY") {
        node.material.color = color;
    }
    if (node.children) {
        node.children.forEach((child) => colorGeometryNodes(child, color));
    }
}

function handleTransformationSelection(boundingBoxNode, intersection) {
    if (!lastIntersection) {
        return;
    }
    const delta = vec3.sub(vec3.create(), intersection, lastIntersection);
    const transformMesh = boundingBoxNode.parent.mesh;
    const objectBaseNode = boundingBoxNode.parent.parent.parent;

    if (transformMesh instanceof TranslateXMesh) {
        objectBaseNode.localMatrix = mat4.translate(
                mat4.create(), objectBaseNode.localMatrix, vec3.fromValues(delta[0], 0, 0));
        transformBoundingPlane = transformMesh.generateXBoundingPlaneNode(boundingBoxNode.worldMatrix);

    } else if (transformMesh instanceof TranslateYMesh) {
        objectBaseNode.localMatrix = mat4.translate(
                mat4.create(), objectBaseNode.localMatrix, vec3.fromValues(0, delta[1], 0));
        transformBoundingPlane = transformMesh.generateYBoundingPlaneNode(boundingBoxNode.worldMatrix);

    } else if (transformMesh instanceof TranslateZMesh) {
        objectBaseNode.localMatrix = mat4.translate(
                mat4.create(), objectBaseNode.localMatrix, vec3.fromValues(0, 0, delta[2]));
        transformBoundingPlane = transformMesh.generateZBoundingPlaneNode(boundingBoxNode.worldMatrix);
    }

    transformBoundingBoxNode = boundingBoxNode;
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
