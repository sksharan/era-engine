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
import {testBoundingBoxIntersection} from './selection/intersection'
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
            return;
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
        transformBoundingPlane = transformMesh.generateXBoundingPlaneNode();

    } else if (transformMesh instanceof TranslateYMesh) {
        objectBaseNode.localMatrix = mat4.translate(
                mat4.create(), objectBaseNode.localMatrix, vec3.fromValues(0, delta[1], 0));
        transformBoundingPlane = transformMesh.generateYBoundingPlaneNode();

    } else if (transformMesh instanceof TranslateZMesh) {
        objectBaseNode.localMatrix = mat4.translate(
                mat4.create(), objectBaseNode.localMatrix, vec3.fromValues(0, 0, delta[2]));
        transformBoundingPlane = transformMesh.generateZBoundingPlaneNode();
    }

    if (transformBoundingPlane) {
        boundingBoxNode.addChild(transformBoundingPlane);
    }
    transformBoundingBoxNode = boundingBoxNode;
}
