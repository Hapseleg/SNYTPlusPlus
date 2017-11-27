var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var app = "http://localhost:1337";

describe('Advanced search', function() {

    // First test
    it("Post request", function(done) {
        // Send some Form Data
        chai.request(app)
            .post('/search')
            .type("form")
            .send({
                "text" : "bla",
                "dateFrom" : "2017-4-4",
                "dateTo" : "2017-11-25",
                "read" : "true",
                "category" : "AC"
            })
            .end(function (err, res) {
                assert.equal(res.res.body.length, 13);
                done();
            });
    });
});