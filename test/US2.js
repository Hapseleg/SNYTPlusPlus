let assert = require('chai').assert;
let request = require('supertest');
let app = require("../app").app;

let agent = request.agent(app);

let login = {
    user : {
        email : "hejmeddig@hej.dk",
        password : "123"
    }
};

let regEx = new RegExp(/\<tr class=\"clickableRow\"/, "g");

describe('Avanceret Søgning', function() {

    before(function(done) {
        agent.post("/")
            .type("form")
            .send(login)
            .end(function(err, res) {
                done();
            });
    });

    it("POST til /search med disse variable skal returnere 4 clickableRows", function(done) {
        agent.post("/search")
            .type("form")
            .send({
                text : "hej",
                dateFrom : "2017-10-01",
                dateTo : "2017-12-06",
                category : ""
            })
            .end(function(err, res) {
                let matches = res.text.match(regEx);
                assert.equal(matches.length, 3);
                done();
            });
    });

    it("POST til /search med disse variable skal returnere 2 clickableRows", function(done) {
        agent.post("/search")
            .type("form")
            .send({
                text : "hej",
                dateFrom : "2017-12-01",
                dateTo : "2017-12-06",
                category : ""

            })
            .end(function(err, res) {
                let matches = res.text.match(regEx);
                assert.equal(matches.length, 1);
                done();
            });
    });

    after(function(done) {
        agent.get('/logout')
            .end(function(err, res) {
                done();
            });
    });
});

