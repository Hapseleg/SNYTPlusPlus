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

let snytEditId = "5a2e420180f28a3ebcbf8b13";

describe("Rediger snyt", function() {

    before(function(done) {
        agent.post("/")
            .type("form")
            .send(login)
            .end(function(err, res) {
                done();
            });
    });

    it("Kan redigere en SNYT", function(done) {

        let snyt = {
            snyt : {
                subject: "Opret snyt testting",
                category : "Logistik",
                text : "Den her SNYT er lavet for at se om testen til at oprette en SNYT virker",
                user : "CKH",
                edok : "",
                created : "2017-12-08T04:20:43.454Z"
            }
        };

        agent.post("/editSnyt")
            .type("form")
            .send({
                snyt : {
                    subject : snyt.snyt.subject,
                    category : snyt.snyt.category,
                    text : snyt.snyt.text + " update",
                    user : "CKH",
                    edok : "",
                    _id : snytEditId,
                    created : snyt.snyt.created
                }
            })
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