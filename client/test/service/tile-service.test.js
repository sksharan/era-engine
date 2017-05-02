'use strict';

const service = require('../../main/source/service/tile-service');
const vec3 = require('gl-matrix').vec3;
const assert = require('chai').assert;

describe('tile-service#getRenderData', function() {
    it('returns correct data for a single tile at the origin', function() {
        let tile = { loc: { x: 0, y: 1, z: 0 } };
        let hexRadius = 5;
        let data = service.getRenderData(tile, hexRadius);

        assertCorrectVertices(tile, hexRadius, data);
    });

    it('returns correct data for adjacent tiles not at the origin', function() {
        let hexRadius = 10;

        let tile1 = { loc: { x: 4, y: 1, z: 4 } };
        let data1 = service.getRenderData(tile1, hexRadius);
        assertCorrectVertices(tile1, hexRadius, data1);

        let tile2 = { loc: { x: 5, y: 2, z: 4 } };
        let data2 = service.getRenderData(tile2, hexRadius);
        assertCorrectVertices(tile2, hexRadius, data2);
    });
});

function assertCorrectVertices(tile, hexRadius, data) {
    let expected = getExpectedVertices(tile, hexRadius);
    let index = 0;

    assertCorrectVertex(data, index++, expected.center);
    assertCorrectVertex(data, index++, expected.right);
    assertCorrectVertex(data, index++, expected.upperRight);

    assertCorrectVertex(data, index++, expected.center);
    assertCorrectVertex(data, index++, expected.upperRight);
    assertCorrectVertex(data, index++, expected.upperLeft);

    assertCorrectVertex(data, index++, expected.center);
    assertCorrectVertex(data, index++, expected.upperLeft);
    assertCorrectVertex(data, index++, expected.left);

    assertCorrectVertex(data, index++, expected.center);
    assertCorrectVertex(data, index++, expected.left);
    assertCorrectVertex(data, index++, expected.lowerLeft);

    assertCorrectVertex(data, index++, expected.center);
    assertCorrectVertex(data, index++, expected.lowerLeft);
    assertCorrectVertex(data, index++, expected.lowerRight);

    assertCorrectVertex(data, index++, expected.center);
    assertCorrectVertex(data, index++, expected.lowerRight);
    assertCorrectVertex(data, index++, expected.right);

    assertCorrectBase(data, index, expected.right, expected.rightBase, expected.lowerRight, expected.lowerRightBase);
    index+=6;

    assertCorrectBase(data, index, expected.lowerRight, expected.lowerRightBase, expected.lowerLeft, expected.lowerLeftBase);
    index+=6;

    assertCorrectBase(data, index, expected.lowerLeft, expected.lowerLeftBase, expected.left, expected.leftBase);
    index+=6;

    assertCorrectBase(data, index, expected.left, expected.leftBase, expected.upperLeft, expected.upperLeftBase);
    index+=6;

    assertCorrectBase(data, index, expected.upperLeft, expected.upperLeftBase, expected.upperRight, expected.upperRightBase);
    index+=6;

    assertCorrectBase(data, index, expected.upperRight, expected.upperRightBase, expected.right, expected.rightBase);
}

function assertCorrectBase(data, index, corner1, base1, corner2, base2) {
    assertCorrectVertex(data, index++, corner1);
    assertCorrectVertex(data, index++, corner2);
    assertCorrectVertex(data, index++, base1);
    assertCorrectVertex(data, index++, corner2);
    assertCorrectVertex(data, index++, base2);
    assertCorrectVertex(data, index++, base1);
}

function assertCorrectVertex(data, index, vertex) {
    const delta = 0.05;

    // Apply the transformation to the vertex before doing the comparison
    let actual = vec3.fromValues(
        data.mesh.vertices[3 * data.mesh.indices[index]],
        data.mesh.vertices[3 * data.mesh.indices[index] + 1],
        data.mesh.vertices[3 * data.mesh.indices[index] + 2]);
    actual = vec3.transformMat4(vec3.create(), actual, data.transform);

    assert.approximately(actual[0], vertex[0], delta);
    assert.approximately(actual[1], vertex[1], delta);
    assert.approximately(actual[2], vertex[2], delta);
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
