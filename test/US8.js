var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var request = require('supertest');
//var app = "http://localhost:1337";
var app = require('../app').app;
var login_details = {
    user: {
        email: 'test6@test.dk',
        password: '123'
    }
};

describe('US8: er han logget ind', function () {
    var agent = request.agent(app);
    describe('luk ned login', function () {
        it('Should be logged in', function (done) {
            agent
                .post('/')
                .type('form')
                .send(login_details)
                .end(function (err, res) {
                    console.log(res.headers["set-cookie"]);
                    assert.isNotEmpty(res.headers["set-cookie"]);
                    done();
                });
        });
    });
});