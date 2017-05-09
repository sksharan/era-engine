'use strict';

/* A Mesh is a collection of vertices, normals, texture coordinates, and indices
   that form a renderable object. */

const gl = require('../gl').context;

function Mesh(vertices, floatsPerVertex, normals, floatsPerNormal, texcoords, floatsPerTexcoord, indices) {
    this.vertices = vertices;
    this.floatsPerVertex = floatsPerVertex;
    this.normals = normals;
    this.floatsPerNormal = floatsPerNormal;
    this.texcoords = texcoords;
    this.floatsPerTexcoord = floatsPerTexcoord;
    this.indices = indices;

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

    this.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
}

module.exports = Mesh;
