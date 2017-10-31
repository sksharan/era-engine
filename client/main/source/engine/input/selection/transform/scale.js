import {TransformMesh, attachToBaseNode} from './transform'
import {whiteColor, redColor, greenColor, blueColor} from './color'
import {SceneNode} from '../../../node/index'
import {gl} from '../../../gl'
import {CurrentTransformOrientation} from '../../../global/index'
import {mat4, vec3} from 'gl-matrix'

class ScaleBaseMesh extends TransformMesh {
    constructor(meshArgs) {
        super(meshArgs);
        this._scaleFactor = 0.01;
    }
    handleUniformTransform({baseSceneNode, intersectionDelta}) {
        super.handleTransform({baseSceneNode, intersectionDelta});
        const scale = mat4.fromScaling(mat4.create(), vec3.fromValues(
                1+intersectionDelta[0]*this._scaleFactor,
                1+intersectionDelta[0]*this._scaleFactor,
                1+intersectionDelta[0]*this._scaleFactor));
        baseSceneNode.applyScaling(scale);
    }
}

class ScaleHandleMesh extends ScaleBaseMesh {
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
    }
}
class ScaleXMesh extends ScaleHandleMesh {
    constructor() {
        super(mat4.create());
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, 0, this._min, this._max, 0, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([this._min, 0, 0, this._max, 0, 0], redColor);
    }
    handleTransform({baseSceneNode, intersectionDelta}) {
        if (CurrentTransformOrientation.isGlobal()) {
            super.handleUniformTransform({baseSceneNode, intersectionDelta});
        } else if (CurrentTransformOrientation.isLocal()) {
            super.handleTransform({baseSceneNode, intersectionDelta});
            const scale = mat4.fromScaling(mat4.create(), vec3.fromValues(1+intersectionDelta[0]*this._scaleFactor, 1, 1));
            baseSceneNode.applyScaling(scale);
        }
    }
}
class ScaleYMesh extends ScaleHandleMesh {
    constructor() {
        super(mat4.fromRotation(mat4.create(), 3.14/2, vec3.fromValues(0, 0, 1)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, this._min, 0, this._max, this._max, 0]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, this._min, 0, 0, this._max, 0], greenColor);
    }
    handleTransform({baseSceneNode, intersectionDelta}) {
        if (CurrentTransformOrientation.isGlobal()) {
            super.handleUniformTransform({baseSceneNode, intersectionDelta});
        } else if (CurrentTransformOrientation.isLocal()) {
            super.handleTransform({baseSceneNode, intersectionDelta});
            const scale = mat4.fromScaling(mat4.create(), vec3.fromValues(1, 1+intersectionDelta[1]*this._scaleFactor, 1));
            baseSceneNode.applyScaling(scale);
        }
    }
}
class ScaleZMesh extends ScaleHandleMesh {
    constructor() {
        super(mat4.fromRotation(mat4.create(), -3.14/2, vec3.fromValues(0, 1, 0)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, 0, this._min, this._max, 0, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, 0, this._min, 0, 0, this._max], blueColor);
    }
    handleTransform({baseSceneNode, intersectionDelta}) {
        if (CurrentTransformOrientation.isGlobal()) {
            super.handleUniformTransform({baseSceneNode, intersectionDelta});
        } else if (CurrentTransformOrientation.isLocal()) {
            super.handleTransform({baseSceneNode, intersectionDelta});
            const scale = mat4.fromScaling(mat4.create(), vec3.fromValues(1, 1, 1+intersectionDelta[2]*this._scaleFactor));
            baseSceneNode.applyScaling(scale);
        }
    }
}

class ScaleCenterMesh extends ScaleBaseMesh {
    constructor() {
        const size = 5.0;
        const positions = [
            -size, -size,  size,
             size, -size,  size,
             size,  size,  size,
            -size,  size,  size,
            -size, -size, -size,
             size, -size, -size,
             size,  size, -size,
            -size,  size, -size,
        ];
        // Normals not needed
        const normals = new Array(positions.length).fill(0);
        // Texcoords not needed
        const texcoords = new Array(positions.length*2/3).fill(0);

        const indices = [
            // Side 1
            0, 1, 2,
            2, 3, 0,
            // Side 2
            1, 5, 6,
            6, 2, 1,
            // Side 3
            0, 3, 4,
            4, 3, 7,
            // Side 4
            7, 5, 4,
            5, 7, 6,
            // Side 5
            0, 5, 1,
            0, 4, 5,
            // Side 6
            3, 2, 6,
            3, 6, 7,
        ];
        super({
            drawMode: gl.TRIANGLES,
            positions,
            normals,
            texcoords,
            indices,
            numVertices: positions.length
        });
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, this._min, 0, this._max, this._max, 0]);
    }
    generateAxisLineGeometryNode() {
        const base = new SceneNode();
        base.addChild(this._generateAxisLineGeometryNode([this._min, 0, 0, this._max, 0, 0], redColor));
        base.addChild(this._generateAxisLineGeometryNode([0, this._min, 0, 0, this._max, 0], greenColor));
        base.addChild(this._generateAxisLineGeometryNode([0, 0, this._min, 0, 0, this._max], blueColor));
        return base;
    }
    handleTransform({baseSceneNode, intersectionDelta}) {
        super.handleUniformTransform({baseSceneNode, intersectionDelta});
    }
}

export const createScaleNode = () => {
    const localMatrix = mat4.create();
    const base = new SceneNode(localMatrix);
    attachToBaseNode({base, mesh: new ScaleXMesh(), color: redColor});
    attachToBaseNode({base, mesh: new ScaleYMesh(), color: greenColor});
    attachToBaseNode({base, mesh: new ScaleZMesh(), color: blueColor});
    attachToBaseNode({base, mesh: new ScaleCenterMesh(), color: whiteColor});
    return base;
}
