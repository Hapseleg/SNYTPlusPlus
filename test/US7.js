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
var subject = 'US7 test';
var category = 'AC';
var text = 'et eller andet';
var user = 'FE';
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

describe('US7: create an update to snyt', function () {
    before(function(done) {
        Snyt.remove({subject: subject}).exec();
        createTestSnyt(done);
    });

    var agent = request.agent(app);

    before(function (done) {
        //Post request to log in.
        agent
            .post('/')
            .type('form')
            .send(login_details)
            .end(function(err, res) {
                // post request to create a subSNYT
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
                console.log(doc);
                assert.isNotEmpty(doc.idSubSnyts);
                done();
            });
        });
    });
