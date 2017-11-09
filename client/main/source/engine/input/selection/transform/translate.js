import {TransformMesh, attachToBaseNode} from './transform'
import {redColor, greenColor, blueColor} from './color'
import {SceneNode} from '../../../node/index'
import {CurrentTransformOrientation} from '../../../global/transform-orientation'
import {gl} from '../../../gl'
import {mat4, vec3} from 'gl-matrix'

class TranslateMesh extends TransformMesh {
    constructor(transform) {
        const shaftLength = 75.0;
        const shaftSize = 1.0;
        const pointerLength = 10.0;
        const pointerSize = 2.0;

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
            shaftLength, 0, 0,
            shaftLength, pointerSize*1.5, 0,
            shaftLength, pointerSize, pointerSize,
            shaftLength, 0, pointerSize*1.5,
            shaftLength, -pointerSize, pointerSize,
            shaftLength, -pointerSize*1.5, 0,
            shaftLength, -pointerSize, -pointerSize,
            shaftLength, 0, -pointerSize*1.5,
            shaftLength, pointerSize, -pointerSize,
            shaftLength + pointerLength, 0, 0,
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
            // pointer base
            0, 9, // degenerate
            9, 8, 10, 11,
            11, 11, // degenerate
            11, 8, 12, 13,
            13, 13, // degenerate
            13, 8, 14, 15,
            15, 15, // degenerate
            15, 8, 16, 9,
            // pointer
            9, 10, // degenerate
            10, 17, 9, 16,
            16, 16, // degenerate
            16, 17, 15, 14,
            14, 14, // degenerate
            14, 17, 13, 12,
            12, 12, // degenerate
            12, 17, 11, 10,
        ];

        super({
            drawMode: gl.TRIANGLE_STRIP,
            positions,
            normals,
            texcoords,
            indices,
            numVertices: positions.length
        });
    }
}
class TranslateXMesh extends TranslateMesh {
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
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        handleTranslation({baseSceneNode, intersectionDelta, intersectionPoint}, 'x');
    }
}
class TranslateYMesh extends TranslateMesh {
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
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        handleTranslation({baseSceneNode, intersectionDelta, intersectionPoint}, 'y');
    }
}
class TranslateZMesh extends TranslateMesh {
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
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        handleTranslation({baseSceneNode, intersectionDelta, intersectionPoint}, 'z');
    }
}

function handleTranslation({baseSceneNode, intersectionDelta, intersectionPoint}, axis) {
    if (CurrentTransformOrientation.isGlobal()) {
        switch (axis) {
            case 'x':
                baseSceneNode.applyTranslation(
                    mat4.fromTranslation(mat4.create(), vec3.fromValues(intersectionDelta[0], 0, 0)));
                break;
            case 'y':
                baseSceneNode.applyTranslation(
                    mat4.fromTranslation(mat4.create(), vec3.fromValues(0, intersectionDelta[1], 0)));
                break;
            case 'z':
                baseSceneNode.applyTranslation(
                    mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, intersectionDelta[2])));
                break;
            default:
                throw new Error(`Invalid axis specified: ${axis}`);
        }
    } else if (CurrentTransformOrientation.isLocal()) {
        // Get last intersection as matrix 'L', using the axes given by the object's world matrix
        const L = mat4.copy(mat4.create(), baseSceneNode.worldMatrix);
        L[12] = intersectionPoint[0] - intersectionDelta[0];
        L[13] = intersectionPoint[1] - intersectionDelta[1];
        L[14] = intersectionPoint[2] - intersectionDelta[2];
        // Get current intersection as matrix 'I', using the axes given by the object's world matrix
        const I = mat4.copy(mat4.create(), baseSceneNode.worldMatrix);
        I[12] = intersectionPoint[0];
        I[13] = intersectionPoint[1];
        I[14] = intersectionPoint[2];
        // Figure out the transform needed to get from L to I by solving for M in the equation L x M = I
        const M = mat4.mul(mat4.create(), mat4.invert(L, L), I);
        // Only consider the axis we are interested in to avoid a "free-form" translation
        switch (axis) {
            case 'x':
                M[13] = M[14] = 0;
                break;
            case 'y':
                M[12] = M[14] = 0;
                break;
            case 'z':
                M[12] = M[13] = 0;
                break;
            default:
                throw new Error(`Invalid axis specified: ${axis}`);
        }
        baseSceneNode.applyTranslation(M);
    } else {
        console.warn('Unknown transform orientation');
    }
}

export const createTranslateNode = () => {
    const localMatrix = mat4.create();
    const base = new SceneNode(localMatrix);
    attachToBaseNode({base, mesh: new TranslateXMesh(), color: redColor});
    attachToBaseNode({base, mesh: new TranslateYMesh(), color: greenColor});
    attachToBaseNode({base, mesh: new TranslateZMesh(), color: blueColor});
    return base;
}
