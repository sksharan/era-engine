import {TransformMesh, attachToBaseNode} from './transform'
import {redColor, greenColor, blueColor} from './color'
import {RenderNode} from '../../../node/index'
import {gl} from '../../../gl'
import {CurrentTransformOrientation} from '../../../global/index'
import {mat4, vec3} from 'gl-matrix'

class ScaleMesh extends TransformMesh {
    constructor(transform) {
        const shaftLength = 75.0;
        const shaftSize = 1.0;
        const pointerSize = 3.0;
        const positions = [
            // shaft
            0, shaftSize, 0,
            0, 0, shaftSize,
            0, -shaftSize, 0,
            0, 0, -shaftSize,
            shaftLength, shaftSize, 0,
            shaftLength, 0, shaftSize,
            shaftLength, -shaftSize, 0,
            shaftLength, 0, -shaftSize,
            // pointer
            shaftLength, -pointerSize, pointerSize,
            shaftLength, pointerSize, pointerSize,
            shaftLength, pointerSize, -pointerSize,
            shaftLength, -pointerSize, -pointerSize,
            shaftLength+2*pointerSize, -pointerSize, pointerSize,
            shaftLength+2*pointerSize, pointerSize, pointerSize,
            shaftLength+2*pointerSize, pointerSize, -pointerSize,
            shaftLength+2*pointerSize, -pointerSize, -pointerSize,
        ];
        for (let i = 0; i < positions.length; i+=3) {
            const transformed = vec3.transformMat4(vec3.create(),
                    vec3.fromValues(positions[i], positions[i+1], positions[i+2]), transform);
            positions[i] = transformed[0];
            positions[i+1] = transformed[1];
            positions[i+2] = transformed[2];
        }
        // Normals not needed
        const normals = new Array(positions.length).fill(0);
        // Texcoords not needed
        const texcoords = new Array(positions.length*2/3).fill(0);

        const indices = [
            // shaft
            4, 0, 5, 1, 6, 2, 7, 3, 4, 0,
            // pointer
            0, 8, // degenerate
            8, 12, 9, 13,
            13, 12, // degenerate
            12, 15, 13, 14,
            14, 15, // degenerate
            15, 11, 14, 10,
            10, 8, // degenerate
            8, 9, 11, 10,
            10, 9, // degnerate
            9, 13, 10, 14,
            14, 12, // degenerate
            12, 8, 15, 11
        ];
        super({
            drawMode: gl.TRIANGLE_STRIP,
            positions,
            normals,
            texcoords,
            indices,
            numVertices: positions.length
        });
        this._scaleFactor = 0.03;
    }
    handleUniformTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        handleScaling({baseSceneNode, intersectionDelta, intersectionPoint}, ['x', 'y', 'z'], this._scaleFactor);
    }
}
class ScaleXMesh extends ScaleMesh {
    constructor() {
        super(mat4.create());
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, 0, this._min, this._max, 0, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([this._min, 0, 0, this._max, 0, 0], redColor);
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        if (CurrentTransformOrientation.isGlobal()) {
            super.handleUniformTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        } else if (CurrentTransformOrientation.isLocal()) {
            super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
            handleScaling({baseSceneNode, intersectionDelta, intersectionPoint}, ['x'], this._scaleFactor);
        }
    }
}
class ScaleYMesh extends ScaleMesh {
    constructor() {
        super(mat4.fromRotation(mat4.create(), 3.14/2, vec3.fromValues(0, 0, 1)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, this._min, 0, this._max, this._max, 0]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, this._min, 0, 0, this._max, 0], greenColor);
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        if (CurrentTransformOrientation.isGlobal()) {
            super.handleUniformTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        } else if (CurrentTransformOrientation.isLocal()) {
            super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
            handleScaling({baseSceneNode, intersectionDelta, intersectionPoint}, ['y'], this._scaleFactor);
        }
    }
}
class ScaleZMesh extends ScaleMesh {
    constructor() {
        super(mat4.fromRotation(mat4.create(), -3.14/2, vec3.fromValues(0, 1, 0)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, 0, this._min, this._max, 0, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, 0, this._min, 0, 0, this._max], blueColor);
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        if (CurrentTransformOrientation.isGlobal()) {
            super.handleUniformTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        } else if (CurrentTransformOrientation.isLocal()) {
            super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
            handleScaling({baseSceneNode, intersectionDelta, intersectionPoint}, ['z'], this._scaleFactor);
        }
    }
}

function handleScaling({baseSceneNode, intersectionDelta, intersectionPoint}, axes, scalingFactor) {
    const baseWorldPosition = mat4.getTranslation(vec3.create(), baseSceneNode.worldMatrix);
    const lastIntersection = vec3.sub(vec3.create(), intersectionPoint, intersectionDelta);
    const scaleUp = vec3.dist(baseWorldPosition, intersectionPoint) > vec3.dist(baseWorldPosition, lastIntersection);
    const scale = vec3.fromValues(1, 1, 1);
    if (axes.includes('x')) {
        scale[0] = scaleUp
                ? 1 + Math.abs(intersectionDelta[0]) * scalingFactor
                : 1 - Math.abs(intersectionDelta[0]) * scalingFactor;
    }
    if (axes.includes('y')) {
        scale[1] = scaleUp
                ? 1 + Math.abs(intersectionDelta[1]) * scalingFactor
                : 1 - Math.abs(intersectionDelta[1]) * scalingFactor;
    }
    if (axes.includes('z')) {
        scale[2] = scaleUp
                ? 1 + Math.abs(intersectionDelta[2]) * scalingFactor
                : 1 - Math.abs(intersectionDelta[2]) * scalingFactor;
    }
    if (axes.includes('x') && axes.includes('y') && axes.includes('z')) {
        scale[2] = scale[1] = scale[0]; // Uniform scaling on all axes
    }
    baseSceneNode.applyScaling(mat4.fromScaling(mat4.create(), scale));
}

export const createScaleNode = () => {
    const localMatrix = mat4.create();
    const base = new RenderNode(localMatrix);
    attachToBaseNode({base, mesh: new ScaleXMesh(), color: redColor});
    attachToBaseNode({base, mesh: new ScaleYMesh(), color: greenColor});
    attachToBaseNode({base, mesh: new ScaleZMesh(), color: blueColor});
    return base;
}
