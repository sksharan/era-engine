import {TransformMesh, attachToBaseNode} from './transform'
import {redTexcoord, greenTexcoord, blueTexcoord} from './color'
import {SceneNode} from '../../../node/index'
import {gl} from '../../../gl'
import {mat4, vec3, glMatrix} from 'gl-matrix'

class RotateMesh extends TransformMesh {
    constructor(texcoord, transform) {
        if (texcoord.length !== 2) {
            throw new TypeError(`Texcoord must have length of 2, but instead has length ${texcoord.length}`);
        }
        const radius = 75;
        const numSegments = 32;
        const segmentLength = 16.0;
        const segmentSize = 1.5;

        // Positions of the base segment
        const basePositions = [
            -segmentLength/2,  segmentSize,   radius,
            -segmentLength/2,  segmentSize/2, radius+segmentSize/2,
            -segmentLength/2,  0,             radius+segmentSize,
            -segmentLength/2, -segmentSize/2, radius+segmentSize/2,
            -segmentLength/2, -segmentSize,   radius,
            -segmentLength/2, -segmentSize/2, radius-segmentSize/2,
            -segmentLength/2,  0,             radius-segmentSize,
            -segmentLength/2,  segmentSize/2, radius-segmentSize/2,

             segmentLength/2,  segmentSize,   radius,
             segmentLength/2,  segmentSize/2, radius+segmentSize/2,
             segmentLength/2,  0,             radius+segmentSize,
             segmentLength/2, -segmentSize/2, radius+segmentSize/2,
             segmentLength/2, -segmentSize,   radius,
             segmentLength/2, -segmentSize/2, radius-segmentSize/2,
             segmentLength/2,  0,             radius-segmentSize,
             segmentLength/2,  segmentSize/2, radius-segmentSize/2,
        ];
        // Rotate the base segment 'numSegments' number of times to get positions of the other segments
        const newPositions = [];
        for (let i = 1; i < numSegments; i++) { // Start at 1 since base positions already exist
            for (let j = 0; j < basePositions.length; j+=3) {
                const transformed = vec3.rotateY(vec3.create(),
                        vec3.fromValues(basePositions[j], basePositions[j+1], basePositions[j+2]),
                        vec3.fromValues(0, 0, 0),
                        glMatrix.toRadian(i*(360/numSegments)));
                newPositions.push(transformed[0], transformed[1], transformed[2]);
            }
        }
        // Base segments plus the rotated segments
        const positions = [...basePositions, ...newPositions];

        // Additional transform to determine axis
        for (let i = 0; i < positions.length; i+=3) {
            const transformed = vec3.transformMat4(vec3.create(),
                    vec3.fromValues(positions[i], positions[i+1], positions[i+2]), transform);
            positions[i] = transformed[0];
            positions[i+1] = transformed[1];
            positions[i+2] = transformed[2];
        }

        // Normals not needed
        const normals = new Array(positions.length).fill(0);

        // Fill 'texcoords' with 'texcoord' - 'texcoords' is 2/3 the length of 'positions'
        let texcoords = new Array(2*positions.length/3);
        for (let i = 0; i < texcoords.length; i+=2) {
            texcoords[i] = texcoord[0];
            texcoords[i+1] = texcoord[1];
        }

        // Indices of the 'base' segment - indices into 'basePositions'
        const baseIndices = [
            0, 1, 8,
            8, 1, 9,
            1, 2, 9,
            9, 2, 10,
            2, 3, 10,
            10, 3, 11,
            3, 4, 11,
            11, 4, 12,
            4, 5, 12,
            12, 5, 13,
            5, 6, 13,
            13, 6, 14,
            6, 7, 14,
            14, 7, 15,
            7, 8, 15,
            0, 8, 7,
        ];
        // Indices of the other rotated segments
        const newIndices = [];
        for (let i = 1; i < numSegments; i++) { // Start at 1 since base indices already exist
            for (let newIndex of baseIndices.map(value => value+(basePositions.length/3)*i)) {
                newIndices.push(newIndex);
            }
        }
        // Indices of base segment plus indices of rotated segment
        const indices = [...baseIndices, ...newIndices];

        super({
            drawMode: gl.TRIANGLES,
            positions,
            normals,
            texcoords,
            indices,
            numVertices: positions.length
        });
    }
}
export class RotateXMesh extends RotateMesh {
    constructor() {
        super(redTexcoord, mat4.fromRotation(mat4.create(), 3.14/2, vec3.fromValues(0, 0, 1)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([0, this._min, this._min, 0, this._max, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([this._min, 0, 0, this._max, 0, 0], redTexcoord);
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        const rad = getRadiansForRotation({baseSceneNode, intersectionDelta, intersectionPoint}, 2, 1);
        baseSceneNode.localMatrix = mat4.rotateX(mat4.create(), baseSceneNode.localMatrix, rad);
    }
}
export class RotateYMesh extends RotateMesh {
    constructor() {
        super(greenTexcoord, mat4.create());
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, 0, this._min, this._max, 0, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, this._min, 0, 0, this._max, 0], greenTexcoord);
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        const rad = getRadiansForRotation({baseSceneNode, intersectionDelta, intersectionPoint}, 0, 2);
        baseSceneNode.localMatrix = mat4.rotateY(mat4.create(), baseSceneNode.localMatrix, rad);
    }
}
export class RotateZMesh extends RotateMesh {
    constructor() {
        super(blueTexcoord, mat4.fromRotation(mat4.create(), -3.14/2, vec3.fromValues(1, 0, 0)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, this._min, 0, this._max, this._max, 0]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, 0, this._min, 0, 0, this._max], blueTexcoord);
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        const rad = getRadiansForRotation({baseSceneNode, intersectionDelta, intersectionPoint}, 1, 0);
        baseSceneNode.localMatrix = mat4.rotateZ(mat4.create(), baseSceneNode.localMatrix, rad);
    }
}
function getRadiansForRotation({baseSceneNode, intersectionDelta, intersectionPoint}, idx1, idx2) {
    const baseTransform = mat4.getTranslation(vec3.create(), baseSceneNode.worldMatrix);

    const delta1 = vec3.subtract(vec3.create(), intersectionPoint, baseTransform);
    const rad1 = Math.atan2(delta1[idx1], delta1[idx2]);

    const lastIntersectionPoint = vec3.subtract(vec3.create(), intersectionPoint, intersectionDelta);
    const delta2 = vec3.subtract(vec3.create(), lastIntersectionPoint, baseTransform);
    const rad2 = Math.atan2(delta2[idx1], delta2[idx2]);

    return rad1 - rad2;
}

export const createRotateNode = () => {
    const localMatrix = mat4.create();
    const base = new SceneNode(localMatrix);
    attachToBaseNode({base, mesh: new RotateXMesh(), zClip: 0.1});
    attachToBaseNode({base, mesh: new RotateYMesh(), zClip: 0.2});
    attachToBaseNode({base, mesh: new RotateZMesh(), zClip: 0.3});
    return base;
}
