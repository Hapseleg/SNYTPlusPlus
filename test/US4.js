process.env.NODE_ENV = 'test';
let assert = require('chai').assert;
let chai = require('chai');
let request = require('supertest');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let Snyt = require('../models/Snyt.model');
let app = require('../app').app;

let login_details = {
    user: {
        email: 'dndwd@djkw.ad',
        password: '123'
    }
};

let sejeId;
let subject = 'US4 test';
let category = 'AC';
let text = 'et eller andet';
let user = 'nogen';
let eDok = 'noget';

function createTestSnyt (done){
    let nysnyt = new Snyt();
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
    let allkvit = /kvitList" type="none"><li>((?:(?!<\/li><\/ul>).)+)/.exec(body)[0].substring(26);
    let res = allkvit.split("</li><li>");
    return res;
}


describe('US4: who has not kvitteret', function () {
    before(function(done) {
        Snyt.remove({subject: subject}).exec();
        createTestSnyt(done);
    });

    let agent = request.agent(app);

    describe('/kvit/:id route should show list', function () {
        let kvitlist;
        it('Should be logged in to show SNYT', function (done) {
            agent
                .post('/')
                .type('form')
                .send(login_details)
                .end(function(err, res) {
                    agent.get('/kvit/' + sejeId)
                        .end(function(err, res) {
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

