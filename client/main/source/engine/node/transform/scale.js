import {TransformMesh, createTransformNode} from './transform'
import {gl} from '../../gl'
import {redTexcoord, greenTexcoord, blueTexcoord} from './rgb'
import {mat4, vec3} from 'gl-matrix'

class ScaleMesh extends TransformMesh {
    constructor(texcoord, transform) {
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

        const texcoords = [
            // shaft
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
            // pointer
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
            ...texcoord,
        ];

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

        this._positions = positions;
        this._scaleFactor = 0.01;
    }

    get positions() {
        return this._positions;
    }
}
export class ScaleXMesh extends ScaleMesh {
    constructor() {
        super(redTexcoord, mat4.create());
    }
    generateBoundingBoxNode() {
        return this._generateBoundingBoxNode([this.min, 0, this.min, this.max, 0, this.max]);
    }
    handleTransform(baseSceneNode, delta) {
        super.handleTransform(baseSceneNode, delta);
        baseSceneNode.localMatrix = mat4.scale(mat4.create(),
                baseSceneNode.localMatrix, vec3.fromValues(1 + delta[0]*this._scaleFactor, 1, 1));
    }
}
export class ScaleYMesh extends ScaleMesh {
    constructor() {
        super(greenTexcoord, mat4.fromRotation(mat4.create(), 3.14/2, vec3.fromValues(0, 0, 1)));
    }
    generateBoundingBoxNode() {
        return this._generateBoundingBoxNode([this.min, this.min, 0, this.max, this.max, 0]);
    }
    handleTransform(baseSceneNode, delta) {
        super.handleTransform(baseSceneNode, delta);
        baseSceneNode.localMatrix = mat4.scale(mat4.create(),
                baseSceneNode.localMatrix, vec3.fromValues(1, 1 + delta[1]*this._scaleFactor, 1));
    }
}
export class ScaleZMesh extends ScaleMesh {
    constructor() {
        super(blueTexcoord, mat4.fromRotation(mat4.create(), -3.14/2, vec3.fromValues(0, 1, 0)));
    }
    generateBoundingBoxNode() {
        return this._generateBoundingBoxNode([this.min, 0, this.min, this.max, 0, this.max]);
    }
    handleTransform(baseSceneNode, delta) {
        super.handleTransform(baseSceneNode, delta);
        baseSceneNode.localMatrix = mat4.scale(mat4.create(),
                baseSceneNode.localMatrix, vec3.fromValues(1, 1, 1 + delta[2]*this._scaleFactor));
    }
}

export const createScaleNode = () => {
    return createTransformNode(new ScaleXMesh(), new ScaleYMesh(), new ScaleZMesh());
}
