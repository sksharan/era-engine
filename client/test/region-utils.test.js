const regionUtils = require('../main/source/region-utils');
const assert = require('chai').assert;

/* 6 indices used to draw each side (each side made up of 2 triangles),
   with 6 sides total, so 6 * 6 = 36 indices total generated. */
const numBaseIndicesGenerated = 36;

describe('region-utils#getVertices', function() {
    it('returns correct data for a single tile at the origin', function() {
        let tile = { loc: { x: 0, y: 1, z: 0 } };
        let hexRadius = 5;
        let data = regionUtils.getRenderData([tile], hexRadius);

        assert.isArray(data.vertices);
        assert.isArray(data.indices);
        assert.lengthOf(data.indices, 18 + numBaseIndicesGenerated);

        assertCorrectVertices(tile, hexRadius, data, 0);
    });

    it('returns correct data for adjacent tiles not at the origin', function() {
        let tile1 = { loc: { x: 4, y: 1, z: 4 } };
        let tile2 = { loc: { x: 5, y: 2, z: 4 } };
        let hexRadius = 10;
        let data = regionUtils.getRenderData([tile1, tile2], hexRadius);

        assert.isArray(data.vertices);
        assert.isArray(data.indices);
        assert.lengthOf(data.indices, 36 + (numBaseIndicesGenerated * 2));

        assertCorrectVertices(tile1, hexRadius, data, 0);
        assertCorrectVertices(tile2, hexRadius, data, data.indices.length / 2);
    });
});

function assertCorrectVertices(tile, hexRadius, data, indexOffset) {
    let expected = getExpectedVertices(tile, hexRadius);

    assertCorrectVertex(data, indexOffset++, expected.center);
    assertCorrectVertex(data, indexOffset++, expected.right);
    assertCorrectVertex(data, indexOffset++, expected.lowerRight);

    assertCorrectVertex(data, indexOffset++, expected.center);
    assertCorrectVertex(data, indexOffset++, expected.lowerRight);
    assertCorrectVertex(data, indexOffset++, expected.lowerLeft);

    assertCorrectVertex(data, indexOffset++, expected.center);
    assertCorrectVertex(data, indexOffset++, expected.lowerLeft);
    assertCorrectVertex(data, indexOffset++, expected.left);

    assertCorrectVertex(data, indexOffset++, expected.center);
    assertCorrectVertex(data, indexOffset++, expected.left);
    assertCorrectVertex(data, indexOffset++, expected.upperLeft);

    assertCorrectVertex(data, indexOffset++, expected.center);
    assertCorrectVertex(data, indexOffset++, expected.upperLeft);
    assertCorrectVertex(data, indexOffset++, expected.upperRight);

    assertCorrectVertex(data, indexOffset++, expected.center);
    assertCorrectVertex(data, indexOffset++, expected.upperRight);
    assertCorrectVertex(data, indexOffset++, expected.right);

    assertCorrectBase(data, indexOffset, expected.right, expected.rightBase,
        expected.lowerRight, expected.lowerRightBase);
    indexOffset+=6;

    assertCorrectBase(data, indexOffset, expected.lowerRight, expected.lowerRightBase,
        expected.lowerLeft, expected.lowerLeftBase);
    indexOffset+=6;

    assertCorrectBase(data, indexOffset, expected.lowerLeft, expected.lowerLeftBase,
        expected.left, expected.leftBase);
    indexOffset+=6;

    assertCorrectBase(data, indexOffset, expected.left, expected.leftBase,
        expected.upperLeft, expected.upperLeftBase);
    indexOffset+=6;

    assertCorrectBase(data, indexOffset, expected.upperLeft, expected.upperLeftBase,
        expected.upperRight, expected.upperRightBase);
    indexOffset+=6;

    assertCorrectBase(data, indexOffset, expected.upperRight, expected.upperRightBase,
        expected.right, expected.rightBase);
}

function assertCorrectBase(data, indexOffset, corner1, base1, corner2, base2) {
    assertCorrectVertex(data, indexOffset++, corner1);
    assertCorrectVertex(data, indexOffset++, base1);
    assertCorrectVertex(data, indexOffset++, corner2);
    assertCorrectVertex(data, indexOffset++, corner2);
    assertCorrectVertex(data, indexOffset++, base1);
    assertCorrectVertex(data, indexOffset++, base2);
}

/* Assert that 'index' refers to the correct 'vertex'. */
function assertCorrectVertex(data, index, vertex) {
    const delta = 0.05;
    assert.approximately(data.vertices[3 * data.indices[index]], vertex[0], delta);
    assert.approximately(data.vertices[3 * data.indices[index] + 1], vertex[1], delta);
    assert.approximately(data.vertices[3 * data.indices[index] + 2], vertex[2], delta);
}

/* Returns an object containing the vertices we would expect to be generated
   given the 'tile' and 'hexRadius'. */
function getExpectedVertices(tile, hexRadius) {
    const centerX = tile.loc.x * hexRadius * 1.5;
    const centerZ = tile.loc.z * hexRadius * 0.866 * 2;
    const shiftFactor = tile.loc.x  % 2 == 0 ? 0 : (hexRadius * 0.866);

    /* See region-utils.js for more info on these calculations. */
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
