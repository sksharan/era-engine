import {TransformMesh, createTransformNode} from './transform'
import {gl} from '../../gl'
import {redTexcoord, greenTexcoord, blueTexcoord} from './rgb'
import {mat4, vec3} from 'gl-matrix'

class TranslateMesh extends TransformMesh {
    constructor(texcoord, transform) {
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
            ...texcoord,
            ...texcoord,
        ];

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

        this._positions = positions;
    }

    get positions() {
        return this._positions;
    }
}
export class TranslateXMesh extends TranslateMesh {
    constructor() {
        super(redTexcoord, mat4.create());
    }
    generateBoundingBoxNode() {
        return this._generateBoundingBoxNode([this.min, 0, this.min, this.max, 0, this.max]);
    }
    handleTransform(baseSceneNode, delta) {
        super.handleTransform(baseSceneNode, delta);
        baseSceneNode.localMatrix = mat4.translate(mat4.create(),
                baseSceneNode.localMatrix, vec3.fromValues(delta[0], 0, 0));
    }
}
export class TranslateYMesh extends TranslateMesh {
    constructor() {
        super(greenTexcoord, mat4.fromRotation(mat4.create(), 3.14/2, vec3.fromValues(0, 0, 1)));
    }
    generateBoundingBoxNode() {
        return this._generateBoundingBoxNode([this.min, this.min, 0, this.max, this.max, 0]);
    }
    handleTransform(baseSceneNode, delta) {
        super.handleTransform(baseSceneNode, delta);
        baseSceneNode.localMatrix = mat4.translate(mat4.create(),
                baseSceneNode.localMatrix, vec3.fromValues(0, delta[1], 0));
    }
}
export class TranslateZMesh extends TranslateMesh {
    constructor() {
        super(blueTexcoord, mat4.fromRotation(mat4.create(), -3.14/2, vec3.fromValues(0, 1, 0)));
    }
    generateBoundingBoxNode() {
        return this._generateBoundingBoxNode([this.min, 0, this.min, this.max, 0, this.max]);
    }
    handleTransform(baseSceneNode, delta) {
        super.handleTransform(baseSceneNode, delta);
        baseSceneNode.localMatrix = mat4.translate(mat4.create(),
                baseSceneNode.localMatrix, vec3.fromValues(0, 0, delta[2]));
    }
}

export const createTranslateNode = () => {
    return createTransformNode(new TranslateXMesh(), new TranslateYMesh(), new TranslateZMesh());
}