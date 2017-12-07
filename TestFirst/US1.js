let assert = require('chai').assert;
let request = require('supertest');
let app = require("../app").app;
let shutdown = require("../app").shutdown;

let agent = request.agent(app);

let login = {
    user : {
        email : "fuckdet@fuck.dk",
        password : "123"
    }
};

let regEx = new RegExp(/\<tr class=\"clickableRow\"/, "g");

describe('Søgning', function() {

    before(function(done) {
        agent.post("/")
            .type("form")
            .send(login)
            .end(function(err, res) {
                done();
            });
    });

    it("GET til /search/asdasdaasdas skal ikke returnere nogle clickableRows", function(done) {

        agent.get("/search/asdasdaasdas")
            .end(function(err, res) {
                let matches = res.text.match(regEx);
                assert.equal(matches, null);
                done();
            });
    });

    it("GET til /search/hej skal returnere 3 clickableRows", function(done) {
        agent.get("/search/hej")
            .end(function(err, res) {
                let matches = res.text.match(regEx);
                assert.equal(matches.length, 3);
                done();
            });
    });

    after(function(done) {
        agent.get('/logout')
            .end(function(err, res) {
                shutdown();
            });
        done();
    })
});

