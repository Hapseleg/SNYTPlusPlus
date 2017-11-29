var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var request = require('request');

var app = "http://localhost:1337";

describe("CRUD bruger", function() {

    var first = "US9";
    var last = "Test";
    var initials = "UT";
    var email = "bla@bla.rip";
    var password = "1234";
    var userId = null;

    it("Post til /admin skal oprette en ny bruger", function(done) {
        // Send some Form Data
        chai.request(app)
            .post('/admin')
            .type("form")
            .send({"user" : {
                "first" : first,
                "last" : last,
                "initials" : initials,
                "email" : email,
                "password" : password
            }})
            .end(function (err, res) {
                chai.request(app)
                    .post('/')
                    .type("form")
                    .send({"user" : {
                        "email" : email,
                        "password" : password}
                    })
                    .end(function (err, res) {
                        assert.notEqual(res.text, "<p>User not found</p>");
                        done();
                    });
            });
    });

    it("PUT til /admin skal ændre en brugers information", function(done) {
        chai.request(app)
            .post("/admin/user")
            .type("form")
            .send({
                email : email,
                password : password
            })
            .end(function(err, res) {
                if(!err) {
                    userId = res.body;
                    console.log("INGEN FEJL!!!!!");
                    console.log(userId);
                    chai.request(app)
                        .put('/admin')
                        .type("form")
                        .send({
                            "id" : userId,
                            "password" : "123456",
                            "firstName" : "john",
                            "lastName" : "bob",
                            "email" : "john@bob.rip",
                            "initials" : "JB"
                        })
                        .end(function (err, res) {
                            console.log("I END!!!");
                            console.log(res);
                            assert.isNull(err);
                            done();
                        });
                } else {
                    console.log(err);
                }
            });
    });

    it("DELETE til /admin skal fjerne bruger", function(done) {
        chai.request(app)
            .delete('/admin')
            .type("form")
            .send({
                "id" : userId
            })
            .end(function (err, res) {
                assert.isNull(err);
                done();
            });
    });
});