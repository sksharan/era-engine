import {gl} from '../gl'

export const NumFloatsPerPosition = 3;
export const NumFloatsPerNormal = 3;
export const NumFloatsPerTexcoord = 2;

export const interleave = (positions, normals, texcoords) => {
    const interleaved = [];

    for (let i = 0; i < positions.length / 3; i++) {
        interleaved.push(positions[i*3], positions[i*3+1], positions[i*3+2]);
        interleaved.push(normals[i*3], normals[i*3+1], normals[i*3+2]);
        interleaved.push(texcoords[i*2], texcoords[i*2+1]);
    }

    return interleaved;
}

export default class Mesh {
    constructor({drawMode=gl.TRIANGLES, vertexData, numVertices, indices}) {
        this._drawMode = drawMode;

        // Interleaves position, normals, and texcoords for each vertex
        this._vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

        this._numVertices = numVertices;

        // Indices (optional)
        this._numIndices = indices ? indices.length : 0;
        if (indices) {
            this._indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        }
    }

    get drawMode() {
        return this._drawMode;
    }

    get numVertices() {
        return this._numVertices;
    }
    get vertexBuffer() {
        return this._vertexBuffer;
    }

    get numIndices() {
        return this._numIndices;
    }
    get indexBuffer() {
        return this._indexBuffer;
    }
    hasIndices() {
        return this._numIndices !== 0;
    }
}
