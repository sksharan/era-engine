const regionUtils = require('../main/source/region-utils');
const assert = require('chai').assert;

const delta = 0.05;

describe('region-utils#getVertices', function() {
    it('returns correct data for a single tile at the origin', function() {
        let tile = { loc: { x: 0, y: 0 } };
        let hexRadius = 5;
        let data = regionUtils.getVertices([tile], hexRadius);

        assert.isArray(data.vertices);
        assert.isArray(data.indices);
        assert.lengthOf(data.indices, 18);

        assertCorrectVertices(tile, hexRadius, data, 0);
    });

    it('returns correct data for adjacent tiles not at the origin', function() {
        let tile1 = { loc: { x: 4, y: 4 } };
        let tile2 = { loc: { x: 5, y: 4 } };
        let hexRadius = 10;
        let data = regionUtils.getVertices([tile1, tile2], hexRadius);

        assert.isArray(data.vertices);
        assert.isArray(data.indices);
        assert.lengthOf(data.indices, 36);

        assertCorrectVertices(tile1, hexRadius, data, 0);
        assertCorrectVertices(tile2, hexRadius, data, 18);
    });
});

function assertCorrectVertices(tile, hexRadius, data, indexOffset) {
    let expected = getExpectedVertices(tile.loc.x, tile.loc.y, hexRadius);

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
}

function getExpectedVertices(locX, locY, hexRadius) {
    const centerX = locX * hexRadius * 1.5;
    const centerZ = locY * hexRadius * 0.866 * 2;
    const shiftFactor = locX % 2 == 0 ? 0 : (hexRadius * 0.866);
    return {
        center:     [centerX,                   0, centerZ + shiftFactor],
        right:      [centerX + hexRadius,       0, centerZ + shiftFactor],
        lowerRight: [centerX + (hexRadius / 2), 0, centerZ + (hexRadius * 0.866) + shiftFactor],
        lowerLeft:  [centerX - (hexRadius / 2), 0, centerZ + (hexRadius * 0.866) + shiftFactor],
        left:       [centerX - hexRadius,       0, centerZ + shiftFactor],
        upperLeft:  [centerX - (hexRadius / 2), 0, centerZ - (hexRadius * 0.866) + shiftFactor],
        upperRight: [centerX + (hexRadius / 2), 0, centerZ - (hexRadius * 0.866) + shiftFactor],
    }
}

function assertCorrectVertex(data, index, vertex) {
    assert.approximately(data.vertices[3 * data.indices[index]], vertex[0], delta);
    assert.approximately(data.vertices[3 * data.indices[index] + 1], vertex[1], delta);
    assert.approximately(data.vertices[3 * data.indices[index] + 2], vertex[2], delta);
}
