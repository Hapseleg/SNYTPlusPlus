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
let subject = 'US7 test';
let category = 'AC';
let text = 'et eller andet';
let user = 'FE';
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

describe('US7: create an update to snyt', function () {
    before(function(done) {
        Snyt.remove({subject: subject}).exec();
        createTestSnyt(done);
    });

    let agent = request.agent(app);

    before(function (done) {
        agent
            .post('/')
            .type('form')
            .send(login_details)
            .end(function(err, res) {
                agent
                    .post('/updateSnyt/'+sejeId)
                    .type('form')
                    .send({
                        subsnyt: {
                            text: 'bmslknfnfdf',
                            _id: sejeId.toString(),
                            created: '2017-01-01'
                        }
                    })
                    .end(function (err, res) {
                        done();
                    })
            });
    });
        it('snyt contains', function (done) {
            Snyt.findById(sejeId).exec(function(err, doc) {
                assert.isNotEmpty(doc.idSubSnyts);
                done();
            });
        });
    });
