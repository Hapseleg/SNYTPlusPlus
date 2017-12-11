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

describe("Opret snyt", function() {

    before(function(done) {
        agent.post("/")
            .type("form")
            .send(login)
            .end(function(err, res) {
                done();
            });
    });

    it("Kan oprette en SNYT", function(done) {

        let snyt = {
            snyt : {
                subject: "Opret snyt testting",
                category : "Logistik",
                text : "Den her SNYT er lavet for at se om testen til at oprette en SNYT virker",
                user : "CKH",
                edok : "",
                created : Date.now()
            }
        };

        agent.post("/opretsnyt")
            .type("form")
            .send(snyt)
            .end(function(err, res) {
                assert.isNull(res.text.match(new RegExp(/html/, "g")));
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