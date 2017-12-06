//TODO DENNE TEST FUNGERER IKKE MERE
var assert = require('chai').assert;
var request = require('request');

describe('Search', function() {
    var nomatch;
    var onematch = [];
    var multiple = [];
    var all = [];

    var requestString = "http://localhost:1337/search";

    before(function(done) {
        request(requestString + "/nomatch", function(error, response, body) {
            if(body) {
                nomatch = JSON.parse(body);
            }
            request(requestString + "/Doh", function(error, response, body) {
                if(body) {
                    onematch = JSON.parse(body);
                }
                request(requestString + "/test", function(error, response, body) {
                    if(body) {
                        multiple = JSON.parse(body);
                    }
                    request(requestString, function(error, response, body) {
                        if(body) {
                            all = JSON.parse(body);
                        }
                        done();
                    });
                });
            });
        });
    });

    // First test
    it('Search should return no object', function() {
        assert.deepEqual(nomatch, []);
    });

    // Second test
    it('Search should return 1 object', function() {
        assert.equal(onematch.length, 1);
    });

    // Third test
    it('Search should return 4 objects', function() {
        assert.equal(multiple.length, 4);
    });

    // Fourth test
    it('Search should return 5 objects', function() {
        assert.equal(all.length, 5);
    });
});

