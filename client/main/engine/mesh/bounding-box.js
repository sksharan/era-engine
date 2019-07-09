import Mesh from './mesh';
import {gl} from '../gl';

export default class BoundingBox extends Mesh {
    constructor(objectPositions) {
        let {minX, minY, minZ, maxX, maxY, maxZ} = computeMinMax(objectPositions);

        const positions = [
            minX,
            minY,
            minZ,
            maxX,
            minY,
            minZ,
            maxX,
            maxY,
            minZ,
            minX,
            maxY,
            minZ,
            minX,
            minY,
            maxZ,
            maxX,
            minY,
            maxZ,
            maxX,
            maxY,
            maxZ,
            minX,
            maxY,
            maxZ
        ];
        const normals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const texcoords = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const indices = [0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 3, 7, 1, 5, 2, 6, 4, 5, 5, 6, 6, 7, 7, 4];

        super({
            drawMode: gl.LINES,
            positions,
            normals,
            texcoords,
            numVertices: positions.length,
            indices
        });

        this._minX = minX;
        this._minY = minY;
        this._minZ = minZ;
        this._maxX = maxX;
        this._maxY = maxY;
        this._maxZ = maxZ;
    }

    get minX() {
        return this._minX;
    }
    get minY() {
        return this._minY;
    }
    get minZ() {
        return this._minZ;
    }
    get maxX() {
        return this._maxX;
    }
    get maxY() {
        return this._maxY;
    }
    get maxZ() {
        return this._maxZ;
    }
}

function computeMinMax(objectPositions) {
    if (objectPositions.length % 3 !== 0) {
        throw new Error(`Invalid position length: ${objectPositions.length}`);
    }
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let minZ = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    let maxZ = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < objectPositions.length; i += 3) {
        let x = objectPositions[i];
        let y = objectPositions[i + 1];
        let z = objectPositions[i + 2];

        if (x < minX) {
            minX = x;
        }
        if (x > maxX) {
            maxX = x;
        }
        if (y < minY) {
            minY = y;
        }
        if (y > maxY) {
            maxY = y;
        }
        if (z < minZ) {
            minZ = z;
        }
        if (z > maxZ) {
            maxZ = z;
        }
    }

    return {minX, minY, minZ, maxX, maxY, maxZ};
}
