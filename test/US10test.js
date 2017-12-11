// During the test the env letiable is set to test
process.env.NODE_ENV = 'test';

let sejeId;
let subject = 'us10test';
let category = 'catg';
let text = 'mad mad mad';
let user = 'bruger';
let eDok = 'eodk';

const assert = require('chai').assert;
let app = require('../app').app;
let Snyt = require('../models/Snyt.model');
let request = require('supertest');

let login_details = {
    user: {
        email: 'test6@test.dk',
        password: '123'
    }
};

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

function findsnyt(body) {
    let edk = /edok]" href="(.[^"]+)/.exec(body)[0].substring(13);
    let sub = /subject]" value="(.[^"]+)/.exec(body)[0].substring(17);
    let cat = /category]" value="(.[^"]+)/.exec(body)[0].substring(18);
    let use = /user]" value="(.[^"]+)/.exec(body)[0].substring(14);
    let cre = /created]" value="(.[^"]+)/.exec(body)[0].substring(17);
    let tex = /text]">(.[^<]+)/.exec(body)[0].substring(7);
    let snyt2 = {
        edok: edk,
        subject: sub,
        category: cat,
        text: tex,
        user: use,
        created: cre
    };
    return snyt2;
}

describe('US10: Read a SNYT', function () {
    before(function(done) {
        Snyt.remove({subject: subject}).exec();
        createTestSnyt(done);
    });
    
    let agent = request.agent(app);

    describe('/snyt/:id route should show correct info', function () {
        let snyt1;
        it('Should be logged in to show SNYT', function (done) {
            agent.post('/')
                .type('form')
                .send(login_details)
                .end(function(err, res) {
                    agent.get('/snyt/' + sejeId)
                        .end(function(err, res) {
                            snyt1 = findsnyt(res.text);
                            done();
                        });
                });
        });

        it('Snyt is the same', function (done) {
            assert.equal(snyt1.subject, subject);
            assert.equal(snyt1.category, category);
            assert.equal(snyt1.text, text);
            assert.equal(snyt1.user, user);
            assert.equal(snyt1.edok, eDok);
            done();
        });
    });
    // after(function(done) {
    //     shutdown();
    //     done();
    // });
});
