let assert = require('chai').assert;
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let request = require('supertest');
let app = require('../app').app;
let login_details = {
    user: {
        email: 'test6@test.dk',
        password: '123'
    }
};

describe('US8: er han logget ind', function () {
    let agent = request.agent(app);
    describe('luk ned login', function () {
        it('Should be logged in', function (done) {
            agent
                .post('/')
                .type('form')
                .send(login_details)
                .end(function (err, res) {
                    assert.isNotEmpty(res.headers["set-cookie"]);
                    done();
                });
        });
    });
});
