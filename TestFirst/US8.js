var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var app = "http://localhost:1337";
var login_details = {
    user: {
        email: 'test2@test.dk',
        password: '1234'
    }
};

describe('er han logget ind', function () {
    var agent = chai.request.agent(app);
    describe('luk ned login', function () {
        it('Should be logged in', function (done) {
            agent
                .post('/')
                .type('form')
                .send(login_details)
                .end(function (err, res) {
                    // console.log(res.request);
                    assert.isAbove(res.request.cookies.length, 1);
                    done();
                });
        });
    });
});
