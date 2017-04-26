'use strict';

const Mesh = require('../../../main/source/render/mesh/mesh-base');
const assert = require('chai').assert;

describe('Creating a mesh', function() {
    it('with no vertices should result in an error', function() {
        try {
            new Mesh(undefined, [], []);
        } catch (e) {
            assert.equal(e.message, 'vertices must be defined');
        }
    });
    it('with no normals should result in an error', function() {
        try {
            new Mesh([], undefined, []);
        } catch (e) {
            assert.equal(e.message, 'normals must be defined');
        }
    });
    it('with no indices should result in an error', function() {
        try {
            new Mesh([], [], undefined);
        } catch (e) {
            assert.equal(e.message, 'indices must be defined');
        }
    });
});
