process.env.NODE_ENV = 'test';
var assert = require('chai').assert;
var chai = require('chai');
var request = require('supertest');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var Snyt = require('../models/Snyt.model');
var app = require('../app').app;

var login_details = {
    user: {
        email: 'dndwd@djkw.ad',
        password: '123'
    }
};

var sejeId;
var subject = 'US4 test';
var category = 'AC';
var text = 'et eller andet';
var user = 'nogen';
var eDok = 'noget';

function createTestSnyt (done){
    var nysnyt = new Snyt();
    nysnyt.subject = subject;
    nysnyt.category = category;
    nysnyt.text = text;
    nysnyt.user = user;
    nysnyt.edok = eDok;
    nysnyt.save(function (err, snyt) {
        if(err){
            return done(err);
        } else{
            sejeId = snyt._id;
            done();
        }
    });
}

function findkvitlist(body) {
    var allkvit = /kvitList" type="none"><li>((?:(?!<\/li><\/ul>).)+)/.exec(body)[0].substring(26);
    var res = allkvit.split("</li><li>");
    console.log(res);
    return res;
}


describe('US4: who has not kvitteret', function () {
    before(function(done) {
        Snyt.remove({subject: subject}).exec();
        createTestSnyt(done);
    });

    var agent = request.agent(app);

    describe('/kvit/:id route should show list', function () {
        let kvitlist;
        it('Should be logged in to show SNYT', function (done) {
            //Post request to log in.
            agent
                .post('/')
                .type('form')
                .send(login_details)
                .end(function(err, res) {
                    // Get request to show a SNYT
                    agent.get('/kvit/' + sejeId)
                        .end(function(err, res) {
                            console.log(sejeId);
                            kvitlist = findkvitlist(res.text);
                            done();
                        });
                });
        });

        it('kvitlist is beautiful', function (done) {
            assert.isArray(kvitlist, 'kvitlist is an array');
            assert.isNotEmpty(kvitlist);

            done();
        });
    });
});

