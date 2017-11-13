import {TransformMesh, attachToBaseNode} from './transform'
import {redColor, greenColor, blueColor, blackColor} from './color'
import {SceneNode} from '../../../node/index'
import {Sphere} from '../../../mesh/index'
import {gl} from '../../../gl'
import {mat4, vec3, glMatrix} from 'gl-matrix'

class RotateMesh extends TransformMesh {
    constructor(transform, {radius=75, numSegments=64, segmentLength=8, segmentSize=0.75} = {}) {
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
        // Texcoords not needed
        const texcoords = new Array(positions.length*2/3).fill(0);

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
class RotateXMesh extends RotateMesh {
    constructor() {
        super(mat4.fromRotation(mat4.create(), 3.14/2, vec3.fromValues(0, 0, 1)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([0, this._min, this._min, 0, this._max, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([this._min, 0, 0, this._max, 0, 0], redColor);
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        handleRotation({baseSceneNode, intersectionDelta, intersectionPoint});
    }
}
class RotateYMesh extends RotateMesh {
    constructor() {
        super(mat4.create());
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, 0, this._min, this._max, 0, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, this._min, 0, 0, this._max, 0], greenColor);
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        handleRotation({baseSceneNode, intersectionDelta, intersectionPoint});
    }
}
class RotateZMesh extends RotateMesh {
    constructor() {
        super(mat4.fromRotation(mat4.create(), -3.14/2, vec3.fromValues(1, 0, 0)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, this._min, 0, this._max, this._max, 0]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, 0, this._min, 0, 0, this._max], blueColor);
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        super.handleTransform({baseSceneNode, intersectionDelta, intersectionPoint});
        handleRotation({baseSceneNode, intersectionDelta, intersectionPoint});
    }
}

function handleRotation({baseSceneNode, intersectionDelta, intersectionPoint}) {
    const baseTranslation = mat4.getTranslation(vec3.create(), baseSceneNode.worldMatrix);
    const lastIntersectionPoint = vec3.subtract(vec3.create(), intersectionPoint, intersectionDelta);

    const baseToLastIntersection = vec3.sub(vec3.create(), lastIntersectionPoint, baseTranslation);
    vec3.normalize(baseToLastIntersection, baseToLastIntersection);

    const baseToIntersection = vec3.sub(vec3.create(), intersectionPoint, baseTranslation);
    vec3.normalize(baseToIntersection, baseToIntersection);

    const rotationAxis = vec3.cross(vec3.create(), baseToLastIntersection, baseToIntersection);
    vec3.normalize(rotationAxis, rotationAxis);

    const rad = Math.acos(vec3.dot(baseToLastIntersection, baseToIntersection));
    const rotation = mat4.fromRotation(mat4.create(), rad, rotationAxis);
    baseSceneNode.applyRotation(rotation);
}

export const createRotateNode = () => {
    const localMatrix = mat4.create();
    const base = new SceneNode(localMatrix);
    const sphereRadius = 75;
    attachToBaseNode({base, mesh: new RotateXMesh(), color: redColor, useSphereClipping: true, sphereRadius});
    attachToBaseNode({base, mesh: new RotateYMesh(), color: greenColor, useSphereClipping: true, sphereRadius});
    attachToBaseNode({base, mesh: new RotateZMesh(), color: blueColor, useSphereClipping: true, sphereRadius});
    attachToBaseNode({base, mesh: new Sphere(sphereRadius, 50, 50), color: blackColor,
            generateBoundingBox: false, useSphereOutling: true});
    return base;
}
