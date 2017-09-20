import {TransformMesh, attachToBaseNode} from './transform'
import SceneNode from '../scene-node'
import {gl} from '../../gl'
import {whiteTexcoord, redTexcoord, greenTexcoord, blueTexcoord} from './color'
import {mat4, vec3} from 'gl-matrix'

class ScaleBaseMesh extends TransformMesh {
    constructor(meshArgs) {
        super(meshArgs);
        this._positions = meshArgs.positions;
        this._scaleFactor = 0.01;
    }
    get positions() {
        return this._positions;
    }
}

class ScaleHandleMesh extends ScaleBaseMesh {
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
    }
}
export class ScaleXMesh extends ScaleHandleMesh {
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
export class ScaleYMesh extends ScaleHandleMesh {
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
export class ScaleZMesh extends ScaleHandleMesh {
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

export class ScaleCenterMesh extends ScaleBaseMesh {
    constructor(texcoord=whiteTexcoord) {
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
        const texcoords = [
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
    generateBoundingBoxNode() {
        return this._generateBoundingBoxNode([this.min, this.min, 0, this.max, this.max, 0]);
    }
    handleTransform(baseSceneNode, delta) {
        super.handleTransform(baseSceneNode, delta);
        baseSceneNode.localMatrix = mat4.scale(mat4.create(),
                baseSceneNode.localMatrix, vec3.fromValues(
                        1 + delta[0]*this._scaleFactor,
                        1 + delta[0]*this._scaleFactor,
                        1 + delta[0]*this._scaleFactor));
    }
}

export const createScaleNode = () => {
    const localMatrix = mat4.create();
    const base = new SceneNode(localMatrix);
    attachToBaseNode({base, mesh: new ScaleXMesh(), zClip: 0.1});
    attachToBaseNode({base, mesh: new ScaleYMesh(), zClip: 0.1});
    attachToBaseNode({base, mesh: new ScaleZMesh(), zClip: 0.1});
    attachToBaseNode({base, mesh: new ScaleCenterMesh(), zClip: 0.0});
    return base;
}
