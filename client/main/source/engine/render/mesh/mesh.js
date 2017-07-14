import {gl} from '../../gl'

export default class Mesh {
    constructor({drawMode=gl.TRIANGLES, vertices, floatsPerVertex, normals, floatsPerNormal,
         texcoords, floatsPerTexcoord, indices}) {

        this._drawMode = drawMode;

        // Vertices
        this._numVertices = vertices.length;
        this._floatsPerVertex = floatsPerVertex;
        this._positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Normals
        this._floatsPerNormal = floatsPerNormal;
        this._normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        // Texcoords
        this._floatsPerTexcoord = floatsPerTexcoord;
        this._texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

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
    get floatsPerVertex() {
        return this._floatsPerVertex;
    }
    get positionBuffer() {
        return this._positionBuffer;
    }

    get floatsPerNormal() {
        return this._floatsPerNormal;
    }
    get normalBuffer() {
        return this._normalBuffer;
    }

    get floatsPerTexcoord() {
        return this._floatsPerTexcoord;
    }
    get texcoordBuffer() {
        return this._texcoordBuffer;
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
