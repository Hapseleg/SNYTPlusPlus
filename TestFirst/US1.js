var assert = require('chai').assert;
var request = require('request');

describe('Search', function() {
    var nomatch;
    var onematch = [];
    var multiple = [];
    var all = [];

    // First test
    request("localhost:1337/search/nomatch", function(error, response, body) {
        if(body) {
            nomatch = JSON.parse(body);
        }
    });
    it('Search should return no object', function() {
        assert.equal(nomatch, []);
    });

    // Second test
    request("localhost:1337/search/Doh", function(error, response, body) {
        if(body) {
            onematch = JSON.parse(body);
        }
    });
    it('Search should return no object', function() {
        assert.equal(onematch.length, 1);
    });

    // Third test
    request("localhost:1337/search/test", function(error, response, body) {
        if(body) {
            multiple = JSON.parse(body);
        }
    });
    it('Search should return no object', function() {
        assert.equal(multiple.length, 4);
    });

    // Fourth test
    request("localhost:1337/search", function(error, response, body) {
        if(body) {
            all = JSON.parse(body);
        }
    });
    it('Search should return no object', function() {
        assert.equal(all.length, 5);
    });
});

