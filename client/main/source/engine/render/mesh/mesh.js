import {gl} from '../../gl'

export default class Mesh {
    constructor({vertices, floatsPerVertex, normals, floatsPerNormal, texcoords, floatsPerTexcoord, indices}) {
        this._vertices = vertices;
        this._floatsPerVertex = floatsPerVertex;
        this._normals = normals;
        this._floatsPerNormal = floatsPerNormal;
        this._texcoords = texcoords;
        this._floatsPerTexcoord = floatsPerTexcoord;
        this._indices = indices;

        this._positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);

        this._normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW);

        this._texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._texcoords), gl.STATIC_DRAW);

        if (indices) {
            this._indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);
        }
    }

    getVertices() {
        return this._vertices;
    }
    getVertex(index) {
        return this._vertices[index];
    }
    getFloatsPerVertex() {
        return this._floatsPerVertex;
    }
    getPositionBuffer() {
        return this._positionBuffer;
    }

    getNormals() {
        return this._normals;
    }
    getNormal(index) {
        return this._normals[index];
    }
    getFloatsPerNormal() {
        return this._floatsPerNormal;
    }
    getNormalBuffer() {
        return this._normalBuffer;
    }

    getTexcoords() {
        return this._texcoords;
    }
    getTexcoord(index) {
        return this._texcoords[index];
    }
    getFloatsPerTexcoord() {
        return this._floatsPerTexcoord;
    }
    getTexcoordBuffer() {
        return this._texcoordBuffer;
    }

    hasIndices() {
        return this._indices !== null && this._indices !== undefined;
    }
    getIndices() {
        return this._indices;
    }
    getIndex(index) {
        return this._indices[index];
    }
    getIndexBuffer() {
        return this._indexBuffer;
    }
}
