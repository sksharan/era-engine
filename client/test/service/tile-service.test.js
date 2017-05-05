'use strict';

const service = require('../../main/source/service/tile-service');
const vec3 = require('gl-matrix').vec3;
const assert = require('chai').assert;
const delta = 0.05;

describe('tile-service#getRenderData', function() {
    it('returns correct data for a single tile at the origin', function() {
        let hexRadius = 5;
        let tile = { loc: { x: 0, y: 1, z: 0 } };
        let data = service.getRenderData(tile, hexRadius);

        assertTranslationMatrix(data.transform, 0, 1, 0);
        assertCorrectMeshData(tile, hexRadius, data);
    });

    it('returns correct data for adjacent tiles not at the origin', function() {
        let hexRadius = 10;

        let tile1 = { loc: { x: 4, y: 1, z: 4 } };
        let data1 = service.getRenderData(tile1, hexRadius);

        assertTranslationMatrix(data1.transform, 60, 1, 69.3);
        assertCorrectMeshData(tile1, hexRadius, data1);

        let tile2 = { loc: { x: 5, y: 2, z: 4 } };
        let data2 = service.getRenderData(tile2, hexRadius);

        assertTranslationMatrix(data2.transform, 75, 2, 77.9);
        assertCorrectMeshData(tile2, hexRadius, data2);
    });
});

/* Assert that the transformation matrix is a translation matrix with
 * with the given x, y, z values. */
function assertTranslationMatrix(transformationMatrix, x, y, z) {
    assert.equal(transformationMatrix[0], 1);
    assert.equal(transformationMatrix[1], 0);
    assert.equal(transformationMatrix[2], 0);
    assert.equal(transformationMatrix[3], 0);

    assert.equal(transformationMatrix[4], 0);
    assert.equal(transformationMatrix[5], 1);
    assert.equal(transformationMatrix[6], 0);
    assert.equal(transformationMatrix[7], 0);

    assert.equal(transformationMatrix[8], 0);
    assert.equal(transformationMatrix[9], 0);
    assert.equal(transformationMatrix[10], 1);
    assert.equal(transformationMatrix[11], 0);

    assert.approximately(transformationMatrix[12], x, delta);
    assert.approximately(transformationMatrix[13], y, delta);
    assert.approximately(transformationMatrix[14], z, delta);
    assert.equal(transformationMatrix[15], 1);
}

/* Assert that the tile with the given hexRadius has the correct mesh data. */
function assertCorrectMeshData(tile, hexRadius, data) {
    let expectedVertices = getExpectedVertices(tile, hexRadius);
    let expectedNormals = getExpectedNormals();
    let index = 0;

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.right, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.upperRight, expectedNormals.up);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.upperRight, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.upperLeft, expectedNormals.up);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.upperLeft, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.left, expectedNormals.up);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.left, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.lowerLeft, expectedNormals.up);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.lowerLeft, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.lowerRight, expectedNormals.up);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.lowerRight, expectedNormals.up);
    assertCorrectVertex(data, index++, expectedVertices.right, expectedNormals.up);

    assertCorrectBase(data, index, expectedVertices.right, expectedVertices.rightBase,
        expectedVertices.lowerRight, expectedVertices.lowerRightBase, expectedNormals.southeast);
    index+=6;

    assertCorrectBase(data, index, expectedVertices.lowerRight, expectedVertices.lowerRightBase,
        expectedVertices.lowerLeft, expectedVertices.lowerLeftBase, expectedNormals.south);
    index+=6;

    assertCorrectBase(data, index, expectedVertices.lowerLeft, expectedVertices.lowerLeftBase,
        expectedVertices.left, expectedVertices.leftBase, expectedNormals.southwest);
    index+=6;

    assertCorrectBase(data, index, expectedVertices.left, expectedVertices.leftBase,
        expectedVertices.upperLeft, expectedVertices.upperLeftBase, expectedNormals.northwest);
    index+=6;

    assertCorrectBase(data, index, expectedVertices.upperLeft, expectedVertices.upperLeftBase,
        expectedVertices.upperRight, expectedVertices.upperRightBase, expectedNormals.north);
    index+=6;

    assertCorrectBase(data, index, expectedVertices.upperRight, expectedVertices.upperRightBase,
        expectedVertices.right, expectedVertices.rightBase, expectedNormals.northeast);
}
function assertCorrectBase(data, index, corner1, base1, corner2, base2, normal) {
    assertCorrectVertex(data, index++, corner1, normal);
    assertCorrectVertex(data, index++, corner2, normal);
    assertCorrectVertex(data, index++, base1, normal);
    assertCorrectVertex(data, index++, corner2, normal);
    assertCorrectVertex(data, index++, base2, normal);
    assertCorrectVertex(data, index++, base1, normal);
}
function assertCorrectVertex(data, index, vertex, normal) {
    // Apply the transformation to the vertex before doing the comparison
    let actualVertex = vec3.fromValues(
        data.mesh.vertices[3 * data.mesh.indices[index]],
        data.mesh.vertices[3 * data.mesh.indices[index] + 1],
        data.mesh.vertices[3 * data.mesh.indices[index] + 2]);
    actualVertex = vec3.transformMat4(vec3.create(), actualVertex, data.transform);

    assert.approximately(actualVertex[0], vertex[0], delta);
    assert.approximately(actualVertex[1], vertex[1], delta);
    assert.approximately(actualVertex[2], vertex[2], delta);

    let actualNormal = vec3.fromValues(
        data.mesh.normals[3 * data.mesh.indices[index]],
        data.mesh.normals[3 * data.mesh.indices[index] + 1],
        data.mesh.normals[3 * data.mesh.indices[index] + 2]);

    assert.approximately(actualNormal[0], normal[0], delta);
    assert.approximately(actualNormal[1], normal[1], delta);
    assert.approximately(actualNormal[2], normal[2], delta);
}
function getExpectedVertices(tile, hexRadius) {
    const centerX = tile.loc.x * hexRadius * 1.5;
    const centerZ = tile.loc.z * hexRadius * 0.866 * 2;
    const shiftFactor = tile.loc.x  % 2 == 0 ? 0 : (hexRadius * 0.866);

    // These vertices can be calcuated using the unit circle using the values at
    // 0, pi/3, 2*pi/3, pi, 4*pi/3, and 5*pi/3 radians.
    return {
        center: [centerX, tile.loc.y, centerZ + shiftFactor],

        right:      [centerX + hexRadius,       tile.loc.y, centerZ + shiftFactor],
        lowerRight: [centerX + (hexRadius / 2), tile.loc.y, centerZ + (hexRadius * 0.866) + shiftFactor],
        lowerLeft:  [centerX - (hexRadius / 2), tile.loc.y, centerZ + (hexRadius * 0.866) + shiftFactor],
        left:       [centerX - hexRadius,       tile.loc.y, centerZ + shiftFactor],
        upperLeft:  [centerX - (hexRadius / 2), tile.loc.y, centerZ - (hexRadius * 0.866) + shiftFactor],
        upperRight: [centerX + (hexRadius / 2), tile.loc.y, centerZ - (hexRadius * 0.866) + shiftFactor],

        rightBase:      [centerX + hexRadius,       0, centerZ + shiftFactor],
        lowerRightBase: [centerX + (hexRadius / 2), 0, centerZ + (hexRadius * 0.866) + shiftFactor],
        lowerLeftBase:  [centerX - (hexRadius / 2), 0, centerZ + (hexRadius * 0.866) + shiftFactor],
        leftBase:       [centerX - hexRadius,       0, centerZ + shiftFactor],
        upperLeftBase:  [centerX - (hexRadius / 2), 0, centerZ - (hexRadius * 0.866) + shiftFactor],
        upperRightBase: [centerX + (hexRadius / 2), 0, centerZ - (hexRadius * 0.866) + shiftFactor],
    }
}
function getExpectedNormals() {
    // If we consider -z direction "north" and +x direction "east"
    return {
        southeast: [0.866, 0, 0.5],
        south:     [0, 0, 1],
        southwest: [-0.866, 0, 0.5],
        northwest: [-0.866, 0, -0.5],
        north:     [0, 0, -1],
        northeast: [0.866, 0, -0.5],
        up:        [0, 1, 0]
    }
}