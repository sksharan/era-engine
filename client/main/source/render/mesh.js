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

Mesh.prototype.getVertices = function() {
    return this.vertices;
}
Mesh.prototype.getVertex = function(index) {
    return this.vertices[index];
}
Mesh.prototype.getFloatsPerVertex = function() {
    return this.floatsPerVertex;
}
Mesh.prototype.getPositionBuffer = function() {
    return this.positionBuffer;
}

Mesh.prototype.getNormals = function() {
    return this.normals;
}
Mesh.prototype.getNormal = function(index) {
    return this.normals[index];
}
Mesh.prototype.getFloatsPerNormal = function() {
    return this.floatsPerNormal;
}
Mesh.prototype.getNormalBuffer = function() {
    return this.normalBuffer;
}

Mesh.prototype.getTexcoords = function() {
    return this.texcoords;
}
Mesh.prototype.getTexcoord = function(index) {
    return this.texcoords[index];
}
Mesh.prototype.getFloatsPerTexcoord = function() {
    return this.floatsPerTexcoord;
}
Mesh.prototype.getTexcoordBuffer = function() {
    return this.texcoordBuffer;
}

Mesh.prototype.getIndices = function() {
    return this.indices;
}
Mesh.prototype.getIndex = function(index) {
    return this.indices[index];
}
Mesh.prototype.getIndexBuffer = function() {
    return this.indexBuffer;
}

module.exports = Mesh;
