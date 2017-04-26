'use strict';

function Mesh(vertices, normals, indices) {
    if (!vertices) throw new Error('vertices must be defined');
    if (!normals) throw new Error('normals must be defined');
    if (!indices) throw new Error('indices must be defined');

    this.vertices = vertices;
    this.normals = normals;
    this.indices = indices;
}

module.exports = Mesh;
