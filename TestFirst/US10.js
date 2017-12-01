var sejeId;
var subject = 'us10test';
var category = 'catg';
var text = 'mad mad mad';
var user = 'bruger';
var eDok = 'eodk';



const assert = require('chai').assert;
var app = require('../app');
var Snyt = require('../models/Snyt.model');
//global.Promise = require('q');
//var app = "http://localhost:1337";

var chai = require('chai'),
    chaiHttp = require('chai-http');

chai.use(chaiHttp);

function createTestSnyt (done){
    var nysnyt = new Snyt();
    nysnyt.subject = subject;
    nysnyt.category = category;
    nysnyt.text = text;
    nysnyt.user = user;
    nysnyt.edok = eDok;
    nysnyt.save(function (err, snyt) {
        if(err){
            console.log('nope');
            return done(err);
        } else{
            sejeId = snyt._id;
            console.log(sejeId);
            console.log('yup');
            console.log(nysnyt.readBy);

            done();
        }
    });
}

function findsnyt(body) {
    console.log(body);
    var edk = /edok]" href="(.[^"]+)/.exec(body)[0];
    var sub = /subject]" value="(.[^"]+)/.exec(body)[0];
    var cat = /category]" value="(.[^"]+)/.exec(body)[0];
    var use = /user]" value="(.[^"]+)/.exec(body)[0];
    var cre = /created]" value="(.[^"]+)/.exec(body)[0];
    var tex = /text]">(.[^<]+)/.exec(body)[0];
    edk=edk.substring(13);
    sub=sub.substring(17);
    cat=cat.substring(18);
    use=use.substring(14);
    cre=cre.substring(17);
    tex=tex.substring(7);
    console.log(edk+sub+cat+use+cre+tex);

    var snyt2 = {
        edok: edk,
        subject: sub,
        category: cat,
        text: tex,
        user: use,
        created: cre
    };
    console.log(snyt2)
    return snyt2;
}

// Snyt.find({_id: req.params.id}).exec().then(function(snyt) {
//     res.json(snyt);
// }).catch(function (err) {
//     console.log(err);
// });


//sejeId = '5a180df55577e6257445dab2';
var snyt1;

describe('/GET/snyt/:id snyt', function () {
    before(function (done) {
        Snyt.remove({subject: 'us10test'});
        console.log('snyt removed');
        done();
    });
    before(function (done) {
        createTestSnyt(done);
    });
    before(function (done) {
        var agent = chai.request.agent('http://localhost:1337');
        agent.post('/').type('form').send( {user: { email: 'test@test.dk', password: '123' }}).then(function (res) {
            //console.log(res);
            //expect(res).to.have.cookie('sessionid');
                // The `agent` now has the sessionid cookie saved, and will send it
                // back to the server in the next request:
            agent.get('/snyt/'+sejeId)
                    .end(function (e,res) {
                        //console.log(res);
                        if(res.text){
                            console.log('hej ' + res.text);
                            snyt1 =  findsnyt(res.text);
                            // edok: body'[edok]" href="xxx"',
                            // subject: body'[subject]" value="xxx"',
                            // category: body'[category]" value="xxx"',
                            // text: body'[text]">xxx<',
                            // user: body'[user]" value="xxx"',
                            // created: body'[created]" value="xxx"'

                        }
                        console.log('MIN SNYT ' + snyt1);
                        done();
                    });
            });
    });
    // before(function (done) {
    //     // Snyt.remove({subject: 'us10test'});
    //     console.log('rimelig sejt: ' + sejeId);
    //     request('http://localhost:1337/snyt/'+sejeId, function (err, res, body) {
        //     console.log();
        //     if(body){
        //         console.log('hej ' + body);
        //         snyt1 =  findsnyt(body);
        //             // edok: body'[edok]" href="xxx"',
        //             // subject: body'[subject]" value="xxx"',
        //             // category: body'[category]" value="xxx"',
        //             // text: body'[text]">xxx<',
        //             // user: body'[user]" value="xxx"',
        //             // created: body'[created]" value="xxx"'
        //
        //     }
        //     console.log('MIN SNYT ' +snyt1);
        //     done();
        // });
    it('snyt er ens', function (done) {
        console.log(subject);
        console.log(snyt1.subject);
        assert.equal(snyt1.subject, subject);
        assert.equal(snyt1.category, category);
        assert.equal(snyt1.text, text);
        assert.equal(snyt1.user, user);
        assert.equal(snyt1.edok, eDok);
        done();
    });
    after(function (done) {
        console.log('lort');
        done();
    })
});