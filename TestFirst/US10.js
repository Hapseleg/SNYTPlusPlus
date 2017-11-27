var sejeId;
var subject = 'us10test';
var category = 'catg';
var text = 'txt';
var user = 'bruger';



const assert = require('chai').assert;
const app = require('../app');
var Snyt = require('../models/Snyt.model');
var request = require('request');

function s (done){
    var nysnyt = new Snyt();
    nysnyt.subject = subject;
    nysnyt.category = category;
    nysnyt.text = text;
    nysnyt.user = user;
    nysnyt.save(function (err, snyt) {
        if(err){
            console.log('nope');
            return done(err);
        } else{
            sejeId = snyt._id;
            console.log(sejeId);
            console.log('yup');
            done();
        }
    });
}


// Snyt.find({_id: req.params.id}).exec().then(function(snyt) {
//     res.json(snyt);
// }).catch(function (err) {
//     console.log(err);
// });


//sejeId = '5a180df55577e6257445dab2';

describe('/GET/snyt/:id snyt', function () {
    var snyt1;
    before(function (done) {
        Snyt.remove({subject: 'us10test'});
        console.log('snyt removed');
        s(done);
        // done();
    });
    before(function (done) {
        // Snyt.remove({subject: 'us10test'});
        console.log('rimelig sejt: ' + sejeId);
        request('http://localhost:1337/snyt/'+sejeId, function (err, res, body) {
            // console.log(sejeId);
            if(body){
                // console.log('hej ' + body);
                snyt1 = JSON.parse(body)[0];
            }
            console.log(snyt1);
            done();
        });
    });
    it('snyt er ens', function () {
        console.log(subject);
        console.log(snyt1.subject);

        assert.equal(snyt1.subject, subject);
        assert.equal(snyt1.category, category);
        assert.equal(snyt1.text, text);
        assert.equal(snyt1.user, user);
    })
});