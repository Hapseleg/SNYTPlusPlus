let assert = require('chai').assert;
let request = require('supertest');
let app = require("../app").app;
let sinon = require('sinon');
let pug = require('pug');

let expect = require('chai').expect;

let agent = request.agent(app);

let login = {
    user : {
        email : "fuckdet@fuck.dk",
        password : "123"
    }
};

describe('Search', function() {

    before(function(done) {
        agent.post("/")
            .type("form")
            .send(login)
            .end(function(err, res) {
                assert.isNotNull(res.headers["set-cookie"]);
                done();
            });
    });

    it("test", function(done) {
        var spy = sinon.spy(pug, '__express');

        agent.get("/search/nomatch")
            .end(function(err, res) {
                console.log(res);
                done();
            });
    });

    after(function() {
        agent.get("/logout");
    });
});