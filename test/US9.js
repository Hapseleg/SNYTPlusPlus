let assert = require('chai').assert;
let request = require('supertest');
let app = require("../app").app;
let shutdown = require("../app").shutdown;

let agent = request.agent(app);

let login = {
    adminUsername : "administrator",
    adminPassword : "pokemon"
};

describe('CRUD bruger', function() {

    let userid = null;

    before(function(done) {
        agent.post("/admin/login")
            .type("form")
            .send(login)
            .end(function(err, res) {
                done();
            });
    });

    describe("Opret bruger", function() {

        let wrong = {
            user : {
                first : "Wrong",
                last : "Wrong",
                initials : "CKH",
                email : "hejmeddig@hej.dk",
                password : "123"
            }
        };

        let correct = {
            user : {
                first : "Correct",
                last : "Correct",
                initials : "CCCC",
                email : "oprettest@opret.dk",
                password : "123"
            }
        };

        it("POST til /admin med \"wrong\" skal render en ny side, så man får html tilbage", function(done) {
            agent.post("/admin")
                .type("form")
                .send(wrong)
                .end(function(err, res) {
                    assert.isNotNull(res.text.match(new RegExp(/html/, "g")));
                    done();
                });
        });

        it("POST til /admin med \"correct\" skal redirect til /admin, så vi får ikke html tilbage", function(done) {
            agent.post("/admin")
                .type("form")
                .send(correct)
                .end(function(err, res) {
                    assert.isNull(res.text.match(new RegExp(/html/, "g")));
                    done();
                });
        });
    });

    describe("Rediger bruger", function() {

        let updateUser = {
            first : "CorrectUpdate",
            last : "CorrectUpdate",
            initials : "CUCU",
            password : "123",
            email : "updatetest@update.dk"
        };

        before(function(done) {
            agent.post("/admin/user")
                .type("form")
                .send({
                    email : "oprettest@opret.dk",
                    password : "123"
                })
                .end(function(err, res) {
                    userid = res.text.substring(1, res.text.length-1);
                    done();
                });
        });

        it("POST til /admin/:userid med rigtig ID og \"updateUser\" skal redirect", function(done) {
            agent.post("/admin/" + userid)
                .type("form")
                .send(updateUser)
                .end(function(err, res) {
                    assert.isNull(res.text.match(new RegExp(/html/, "g")));
                    done();
                });
        });

        it("POST til /admin/:userid med forkert ID skal returnere html", function(done) {
            agent.post("/admin/111111111111")
                .type("form")
                .send(updateUser)
                .end(function(err, res) {
                    assert.isNotNull(res.text.match(new RegExp(/html/, "g")));
                    done();
                });
        });

    });

    describe("Slet bruger", function() {

        it("DELETE til /admin med rigtig ID skal redirect", function(done) {
            agent.delete("/admin")
                .type("form")
                .send({
                    id : userid
                })
                .end(function(err, res) {
                    assert.isNull(res.text.match(new RegExp(/html/, "g")));
                    done();
                });
        });

        it("DELETE til /admin med forkert ID skal returnere html", function(done) {
            agent.delete("/admin")
                .type("form")
                .send({
                    id : "111111111111"
                })
                .end(function(err, res) {
                    assert.isNotNull(res.text.match(new RegExp(/html/, "g")));
                    done();
                });
        });

    });

    after(function(done) {
        agent.get('/admin/logout')
            .end(function(err, res) {
                done();
            });
    })
});