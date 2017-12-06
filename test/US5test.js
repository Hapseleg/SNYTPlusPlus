// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var sejeId;
let subject = 'us5test';
let category = 'catg';
let text = 'mad mad mad';
let user = 'bruger';
let eDok = 'eodk';

const assert = require('chai').assert;
let app = require('../app').app;
let shutdown = require('../app').shutdown;
let Snyt = require('../models/Snyt.model');
let User = require('../models/User.model');
let request = require('supertest');
let should = require('should');

let login_details = {
    user: {
        email: 'test6@test.dk',
        password: '123'
    }
};

let userDetails = {
    
};

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
describe('US5: Læsekvittere a SNYT', function() {
    let uid;
    let us5SNYT;
    before(function(done) {
        Snyt.remove( {subject: subject}).exec();
        User.findOne(login_details.user).exec().then(function(user) {
            uid = user._id;
            console.log(user);
        });
        createTestSnyt(done);
    });

    var agent = request.agent(app);
     
    describe('/snyt/:id post route should læsekvittere', function () {
        it('Should be logged in to læsekvittere', function(done) {
            agent.post('/')
                .type('form')
                .send(login_details)
                .end(function(err, res) {
                    agent.post('/snyt/'+sejeId)
                        .end(function(err, res) {
                            done();
                        });
                });
        });

        it('SNYT should be læsekvitteret now', function(done) {
            Snyt.findOne({ _id: sejeId}).exec().then(function(snyt) {
                console.log(snyt);
                console.log(uid);
                let hasRead = snyt.readBy.indexOf(uid) > -1;
                assert.equal(true, hasRead);
                done();
            }).catch(function(err) {
                console.warn(err.toString());
            });
        });
    });

});
