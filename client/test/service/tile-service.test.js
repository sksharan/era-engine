'use strict';

const service = require('../../main/source/service/tile-service');
const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;
const assert = require('chai').assert;
const delta = 0.05;

describe('tile-service#getRenderData', function() {
    it('returns correct data for a single tile at the origin', function() {
        let hexRadius = 5;
        let tile = { loc: { x: 0, y: 1, z: 0 } };
        let data = service.getRenderData(tile, hexRadius);

        assertTranslationMatrix(data.localMatrix, 0, 1, 0);
        assertCorrectMeshData(tile, hexRadius, data);
    });

    it('returns correct data for adjacent tiles not at the origin', function() {
        let hexRadius = 10;

        let tile1 = { loc: { x: 4, y: 1, z: 4 } };
        let data1 = service.getRenderData(tile1, hexRadius);

        assertTranslationMatrix(data1.localMatrix, 60, 1, 69.3);
        assertCorrectMeshData(tile1, hexRadius, data1);

        let tile2 = { loc: { x: 5, y: 2, z: 4 } };
        let data2 = service.getRenderData(tile2, hexRadius);

        assertTranslationMatrix(data2.localMatrix, 75, 2, 77.9);
        assertCorrectMeshData(tile2, hexRadius, data2);
    });
});

/* Assert that the local matrix is a translation matrix with
 * with the given x, y, z values. */
function assertTranslationMatrix(localMatrix, x, y, z) {
    assert.equal(localMatrix[0], 1);
    assert.equal(localMatrix[1], 0);
    assert.equal(localMatrix[2], 0);
    assert.equal(localMatrix[3], 0);

    assert.equal(localMatrix[4], 0);
    assert.equal(localMatrix[5], 1);
    assert.equal(localMatrix[6], 0);
    assert.equal(localMatrix[7], 0);

    assert.equal(localMatrix[8], 0);
    assert.equal(localMatrix[9], 0);
    assert.equal(localMatrix[10], 1);
    assert.equal(localMatrix[11], 0);

    assert.approximately(localMatrix[12], x, delta);
    assert.approximately(localMatrix[13], y, delta);
    assert.approximately(localMatrix[14], z, delta);
    assert.equal(localMatrix[15], 1);
}

/* Assert that the tile with the given hexRadius has the correct mesh data. */
function assertCorrectMeshData(tile, hexRadius, data) {
    let expectedVertices = getExpectedVertices(tile, hexRadius);
    let expectedNormals = getExpectedNormals();
    let expectedTexcoords = getExpectedTexcoords();
    let index = 0;

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up, expectedTexcoords.center);
    assertCorrectVertex(data, index++, expectedVertices.right, expectedNormals.up, expectedTexcoords.right);
    assertCorrectVertex(data, index++, expectedVertices.upperRight, expectedNormals.up, expectedTexcoords.upperRight);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up, expectedTexcoords.center);
    assertCorrectVertex(data, index++, expectedVertices.upperRight, expectedNormals.up, expectedTexcoords.upperRight);
    assertCorrectVertex(data, index++, expectedVertices.upperLeft, expectedNormals.up, expectedTexcoords.upperLeft);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up, expectedTexcoords.center);
    assertCorrectVertex(data, index++, expectedVertices.upperLeft, expectedNormals.up, expectedTexcoords.upperLeft);
    assertCorrectVertex(data, index++, expectedVertices.left, expectedNormals.up, expectedTexcoords.left);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up, expectedTexcoords.center);
    assertCorrectVertex(data, index++, expectedVertices.left, expectedNormals.up, expectedTexcoords.left);
    assertCorrectVertex(data, index++, expectedVertices.lowerLeft, expectedNormals.up, expectedTexcoords.lowerLeft);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up, expectedTexcoords.center);
    assertCorrectVertex(data, index++, expectedVertices.lowerLeft, expectedNormals.up, expectedTexcoords.lowerLeft);
    assertCorrectVertex(data, index++, expectedVertices.lowerRight, expectedNormals.up, expectedTexcoords.lowerRight);

    assertCorrectVertex(data, index++, expectedVertices.center, expectedNormals.up, expectedTexcoords.center);
    assertCorrectVertex(data, index++, expectedVertices.lowerRight, expectedNormals.up, expectedTexcoords.lowerRight);
    assertCorrectVertex(data, index++, expectedVertices.right, expectedNormals.up, expectedTexcoords.right);

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
    let expectedTexcoords = getExpectedTexcoords();

    assertCorrectVertex(data, index++, corner1, normal, expectedTexcoords.baseTopRight);
    assertCorrectVertex(data, index++, corner2, normal, expectedTexcoords.baseTopLeft);
    assertCorrectVertex(data, index++, base1, normal, expectedTexcoords.baseBottomRight);
    assertCorrectVertex(data, index++, corner2, normal, expectedTexcoords.baseTopLeft);
    assertCorrectVertex(data, index++, base2, normal, expectedTexcoords.baseBottomLeft);
    assertCorrectVertex(data, index++, base1, normal, expectedTexcoords.baseBottomRight);
}
function assertCorrectVertex(data, index, vertex, normal, texcoords) {
    // Apply the transformation to the vertex before doing the comparison
    let actualVertex = vec3.fromValues(
        data.mesh.getVertex(3 * data.mesh.getIndex(index)),
        data.mesh.getVertex(3 * data.mesh.getIndex(index) + 1),
        data.mesh.getVertex(3 * data.mesh.getIndex(index) + 2));
    actualVertex = vec3.transformMat4(vec3.create(), actualVertex, data.localMatrix);

    assert.approximately(actualVertex[0], vertex[0], delta);
    assert.approximately(actualVertex[1], vertex[1], delta);
    assert.approximately(actualVertex[2], vertex[2], delta);

    let actualNormal = vec3.fromValues(
        data.mesh.getNormal(3 * data.mesh.getIndex(index)),
        data.mesh.getNormal(3 * data.mesh.getIndex(index) + 1),
        data.mesh.getNormal(3 * data.mesh.getIndex(index) + 2));

    assert.approximately(actualNormal[0], normal[0], delta);
    assert.approximately(actualNormal[1], normal[1], delta);
    assert.approximately(actualNormal[2], normal[2], delta);

    let actualTexcoords = vec2.fromValues(
        data.mesh.getTexcoord(2 * data.mesh.getIndex(index)),
        data.mesh.getTexcoord(2 * data.mesh.getIndex(index) + 1));

    assert.approximately(actualTexcoords[0], texcoords[0], delta);
    assert.approximately(actualTexcoords[1], texcoords[1], delta);
}
function getExpectedVertices(tile, hexRadius) {
    const centerX = tile.loc.x * hexRadius * 1.5;
    const centerZ = tile.loc.z * hexRadius * 0.866 * 2;
    const shiftFactor = tile.loc.x  % 2 == 0 ? 0 : (hexRadius * 0.866);

    // These vertices can be calcuated using the unit circle using the values at
    // 0, pi/3, 2*pi/3, pi, 4*pi/3, and 5*pi/3 radians.
    return {
        center: [centerX, tile.loc.y, centerZ + shiftFactor],

        // Vertices at top of tile and top of base
        right:      [centerX + hexRadius,       tile.loc.y, centerZ + shiftFactor],
        lowerRight: [centerX + (hexRadius / 2), tile.loc.y, centerZ + (hexRadius * 0.866) + shiftFactor],
        lowerLeft:  [centerX - (hexRadius / 2), tile.loc.y, centerZ + (hexRadius * 0.866) + shiftFactor],
        left:       [centerX - hexRadius,       tile.loc.y, centerZ + shiftFactor],
        upperLeft:  [centerX - (hexRadius / 2), tile.loc.y, centerZ - (hexRadius * 0.866) + shiftFactor],
        upperRight: [centerX + (hexRadius / 2), tile.loc.y, centerZ - (hexRadius * 0.866) + shiftFactor],

        // Vertices at bottom of base
        rightBase:      [centerX + hexRadius,       0, centerZ + shiftFactor],
        lowerRightBase: [centerX + (hexRadius / 2), 0, centerZ + (hexRadius * 0.866) + shiftFactor],
        lowerLeftBase:  [centerX - (hexRadius / 2), 0, centerZ + (hexRadius * 0.866) + shiftFactor],
        leftBase:       [centerX - hexRadius,       0, centerZ + shiftFactor],
        upperLeftBase:  [centerX - (hexRadius / 2), 0, centerZ - (hexRadius * 0.866) + shiftFactor],
        upperRightBase: [centerX + (hexRadius / 2), 0, centerZ - (hexRadius * 0.866) + shiftFactor]
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
function getExpectedTexcoords() {
    return {
        center: [0.5, 0.5],

        // Top of tile
        right:      [1.0,  0.5],
        lowerRight: [0.75, 0],
        lowerLeft:  [0.25, 0],
        left:       [0,    0.5],
        upperLeft:  [0.25, 1.0],
        upperRight: [0.75, 1.0],

        // Tile base
        baseTopRight:    [0.75, 1.0],
        baseBottomRight: [0.75, 0],
        baseTopLeft:     [0.25, 1.0],
        baseBottomLeft:  [0.25, 0]
    }
}
