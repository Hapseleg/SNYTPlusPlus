var sejeId;
var subject = 'subj';
var category = 'catg';
var text = 'txt';
var user = 'bruger';



const assert = require('chai').assert;
const app = require('../app');
var Snyt = require('../models/Snyt.model');
var request = require('request');

function s (){
    console.log('s');
    var nysnyt = new Snyt();
    nysnyt.subject = subject;
    nysnyt.category = category;
    nysnyt.text = text;
    nysnyt.user = user;
    nysnyt.save(function (err, snyt) {
        if(err){
            console.log('nope');
            res.send('Du er blevet snyt(: ' + err);
        } else{
            sejeId = snyt._id;
            console.log(sejeId);
            console.log('yup');
        }
    });
}


// Snyt.find({_id: req.params.id}).exec().then(function(snyt) {
//     res.json(snyt);
// }).catch(function (err) {
//     console.log(err);
// });


sejeId = '5a180df55577e6257445dab2';

describe('/GET/snyt/:id snyt', function () {
    var snyt1;
    before(function (done) {
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