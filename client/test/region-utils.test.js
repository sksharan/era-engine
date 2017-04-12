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

        let center = [0, 0, 0];
        let right = [5, 0, 0];
        let lowerRight = [2.5, 0, 4.33];
        let lowerLeft = [-2.5, 0, 4.33];
        let left = [-5, 0, 0];
        let upperLeft = [-2.5, 0, -4.33];
        let upperRight = [2.5, 0, -4.33];

        assertCorrectVertex(data, 0, center);
        assertCorrectVertex(data, 1, right);
        assertCorrectVertex(data, 2, lowerRight);

        assertCorrectVertex(data, 3, center);
        assertCorrectVertex(data, 4, lowerRight);
        assertCorrectVertex(data, 5, lowerLeft);

        assertCorrectVertex(data, 6, center);
        assertCorrectVertex(data, 7, lowerLeft);
        assertCorrectVertex(data, 8, left);

        assertCorrectVertex(data, 9, center);
        assertCorrectVertex(data, 10, left);
        assertCorrectVertex(data, 11, upperLeft);

        assertCorrectVertex(data, 12, center);
        assertCorrectVertex(data, 13, upperLeft);
        assertCorrectVertex(data, 14, upperRight);

        assertCorrectVertex(data, 15, center);
        assertCorrectVertex(data, 16, upperRight);
        assertCorrectVertex(data, 17, right);
    });

    it('returns correct data for adjacent tiles not at the origin', function() {
        let tile1 = { loc: { x: 4, y: 4 } };
        let tile2 = { loc: { x: 5, y: 4 } };
        let hexRadius = 10;
        let data = regionUtils.getVertices([tile1, tile2], hexRadius);

        assert.isArray(data.vertices);
        assert.isArray(data.indices);
        assert.lengthOf(data.indices, 36);

        let center1 = [80, 0, 80];
        let right1 = [90, 0, 80];
        let lowerRight1 = [85, 0, 88.66];
        let lowerLeft1 = [75, 0, 88.66];
        let left1 = [70, 0, 80];
        let upperLeft1 = [75, 0, 71.34];
        let upperRight1 = [85, 0, 71.34];

        assertCorrectVertex(data, 0, center1);
        assertCorrectVertex(data, 1, right1);
        assertCorrectVertex(data, 2, lowerRight1);

        assertCorrectVertex(data, 3, center1);
        assertCorrectVertex(data, 4, lowerRight1);
        assertCorrectVertex(data, 5, lowerLeft1);

        assertCorrectVertex(data, 6, center1);
        assertCorrectVertex(data, 7, lowerLeft1);
        assertCorrectVertex(data, 8, left1);

        assertCorrectVertex(data, 9, center1);
        assertCorrectVertex(data, 10, left1);
        assertCorrectVertex(data, 11, upperLeft1);

        assertCorrectVertex(data, 12, center1);
        assertCorrectVertex(data, 13, upperLeft1);
        assertCorrectVertex(data, 14, upperRight1);

        assertCorrectVertex(data, 15, center1);
        assertCorrectVertex(data, 16, upperRight1);
        assertCorrectVertex(data, 17, right1);

        // tile2.loc.x is odd, so tile z coordinates will be shifted
        let center2 = [100, 0, 80 + 10];
        let right2 = [110, 0, 80 + 10];
        let lowerRight2 = [105, 0, 88.66 + 10];
        let lowerLeft2 = [95, 0, 88.66 + 10];
        let left2 = [90, 0, 80 + 10];
        let upperLeft2 = [95, 0, 71.34 + 10];
        let upperRight2 = [105, 0, 71.34 + 10];

        assertCorrectVertex(data, 18, center2);
        assertCorrectVertex(data, 19, right2);
        assertCorrectVertex(data, 20, lowerRight2);

        assertCorrectVertex(data, 21, center2);
        assertCorrectVertex(data, 22, lowerRight2);
        assertCorrectVertex(data, 23, lowerLeft2);

        assertCorrectVertex(data, 24, center2);
        assertCorrectVertex(data, 25, lowerLeft2);
        assertCorrectVertex(data, 26, left2);

        assertCorrectVertex(data, 27, center2);
        assertCorrectVertex(data, 28, left2);
        assertCorrectVertex(data, 29, upperLeft2);

        assertCorrectVertex(data, 30, center2);
        assertCorrectVertex(data, 31, upperLeft2);
        assertCorrectVertex(data, 32, upperRight2);

        assertCorrectVertex(data, 33, center2);
        assertCorrectVertex(data, 34, upperRight2);
        assertCorrectVertex(data, 35, right2);
    });
});

function assertCorrectVertex(data, index, vertex, message) {
    assert.approximately(data.vertices[data.indices[index]], vertex[0], delta, message);
    assert.approximately(data.vertices[data.indices[index] + 1], vertex[1], delta, message);
    assert.approximately(data.vertices[data.indices[index] + 2], vertex[2], delta, message);
}
