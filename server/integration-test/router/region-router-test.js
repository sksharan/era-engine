const assert = require('chai').assert;
const async = require('async');
const request = require('request');
const config = require('../test-config');
const Region = require('../../main/model/region');

function getRegionsUrl() {
    return 'http://localhost:' + config.port + "/regions";
}

beforeEach(function(done) {
    /* Remove all Regions from the db before each test. */
    Region.remove({}, function() {
        done();
    });
});

describe('/regions', function() {
    describe('GET', function() {
        it('should return all regions', function(done) {
            async.parallel({
                region1: function(callback) {
                    new Region().save(function(err, region) {
                        callback(null, region.get('_id'));
                    });
                },
                region2: function(callback) {
                    new Region().save(function(err, region) {
                        callback(null, region.get('_id'));
                    });
                },
                region3: function(callback) {
                    new Region().save(function(err, region) {
                        callback(null, region.get('_id'));
                    });
                }
            }, function(err, results) {
                request(getRegionsUrl(), function(err, res, body) {
                    assert.ifError(err);
                    assert.strictEqual(res.statusCode, 200);
                    assert.equal(3, JSON.parse(body).length);
                    done();
                });
            });
        });
    });
});
