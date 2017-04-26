'use strict';

const region = require('../../../main/source/render/mesh/region');
const assert = require('chai').assert;

/* 6 indices used to draw each side (each side made up of 2 triangles),
   with 6 sides total, so 6 * 6 = 36 indices total generated. */
const numBaseIndicesGenerated = 36;

describe('region#getMesh', function() {
    it('returns correct mesh data for a single tile at the origin', function() {
        let tile = { loc: { x: 0, y: 1, z: 0 } };
        let hexRadius = 5;
        let mesh = region.getMesh([tile], hexRadius);

        assert.isArray(mesh.vertices);
        assert.isArray(mesh.indices);
        assert.lengthOf(mesh.indices, 18 + numBaseIndicesGenerated);

        assertCorrectVertices(tile, hexRadius, mesh, 0);
    });

    it('returns correct mesh data for adjacent tiles not at the origin', function() {
        let tile1 = { loc: { x: 4, y: 1, z: 4 } };
        let tile2 = { loc: { x: 5, y: 2, z: 4 } };
        let hexRadius = 10;
        let mesh = region.getMesh([tile1, tile2], hexRadius);

        assert.isArray(mesh.vertices);
        assert.isArray(mesh.indices);
        assert.lengthOf(mesh.indices, 36 + (numBaseIndicesGenerated * 2));

        assertCorrectVertices(tile1, hexRadius, mesh, 0);
        assertCorrectVertices(tile2, hexRadius, mesh, mesh.indices.length / 2);
    });
});

function assertCorrectVertices(tile, hexRadius, mesh, indexOffset) {
    let expected = getExpectedVertices(tile, hexRadius);

    assertCorrectVertex(mesh, indexOffset++, expected.center);
    assertCorrectVertex(mesh, indexOffset++, expected.right);
    assertCorrectVertex(mesh, indexOffset++, expected.lowerRight);

    assertCorrectVertex(mesh, indexOffset++, expected.center);
    assertCorrectVertex(mesh, indexOffset++, expected.lowerRight);
    assertCorrectVertex(mesh, indexOffset++, expected.lowerLeft);

    assertCorrectVertex(mesh, indexOffset++, expected.center);
    assertCorrectVertex(mesh, indexOffset++, expected.lowerLeft);
    assertCorrectVertex(mesh, indexOffset++, expected.left);

    assertCorrectVertex(mesh, indexOffset++, expected.center);
    assertCorrectVertex(mesh, indexOffset++, expected.left);
    assertCorrectVertex(mesh, indexOffset++, expected.upperLeft);

    assertCorrectVertex(mesh, indexOffset++, expected.center);
    assertCorrectVertex(mesh, indexOffset++, expected.upperLeft);
    assertCorrectVertex(mesh, indexOffset++, expected.upperRight);

    assertCorrectVertex(mesh, indexOffset++, expected.center);
    assertCorrectVertex(mesh, indexOffset++, expected.upperRight);
    assertCorrectVertex(mesh, indexOffset++, expected.right);

    assertCorrectBase(mesh, indexOffset, expected.right, expected.rightBase,
        expected.lowerRight, expected.lowerRightBase);
    indexOffset+=6;

    assertCorrectBase(mesh, indexOffset, expected.lowerRight, expected.lowerRightBase,
        expected.lowerLeft, expected.lowerLeftBase);
    indexOffset+=6;

    assertCorrectBase(mesh, indexOffset, expected.lowerLeft, expected.lowerLeftBase,
        expected.left, expected.leftBase);
    indexOffset+=6;

    assertCorrectBase(mesh, indexOffset, expected.left, expected.leftBase,
        expected.upperLeft, expected.upperLeftBase);
    indexOffset+=6;

    assertCorrectBase(mesh, indexOffset, expected.upperLeft, expected.upperLeftBase,
        expected.upperRight, expected.upperRightBase);
    indexOffset+=6;

    assertCorrectBase(mesh, indexOffset, expected.upperRight, expected.upperRightBase,
        expected.right, expected.rightBase);
}

function assertCorrectBase(mesh, indexOffset, corner1, base1, corner2, base2) {
    assertCorrectVertex(mesh, indexOffset++, corner1);
    assertCorrectVertex(mesh, indexOffset++, base1);
    assertCorrectVertex(mesh, indexOffset++, corner2);
    assertCorrectVertex(mesh, indexOffset++, corner2);
    assertCorrectVertex(mesh, indexOffset++, base1);
    assertCorrectVertex(mesh, indexOffset++, base2);
}

/* Assert that 'index' refers to the correct 'vertex'. */
function assertCorrectVertex(mesh, index, vertex) {
    const delta = 0.05;
    assert.approximately(mesh.vertices[3 * mesh.indices[index]], vertex[0], delta);
    assert.approximately(mesh.vertices[3 * mesh.indices[index] + 1], vertex[1], delta);
    assert.approximately(mesh.vertices[3 * mesh.indices[index] + 2], vertex[2], delta);
}

/* Returns an object containing the vertices we would expect to be generated
   given the 'tile' and 'hexRadius'. */
function getExpectedVertices(tile, hexRadius) {
    const centerX = tile.loc.x * hexRadius * 1.5;
    const centerZ = tile.loc.z * hexRadius * 0.866 * 2;
    const shiftFactor = tile.loc.x  % 2 == 0 ? 0 : (hexRadius * 0.866);

    /* These vertices can be calcuated using the unit circle: the hexagon points
       would be at 0, pi/3, 2*pi/3, pi, 4*pi/3, and 5*pi/3 radians. */
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
