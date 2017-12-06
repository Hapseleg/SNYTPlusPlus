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
                        console.log(res);
                        done();
                    })
            });
    });
        it('snyt contains', function () {
            this.timeout(30000);
            Snyt.findById(sejeId).exec(function(err, doc) {
                console.log(doc);
                assert.isNotEmpty(doc.idSubSnyts);
            });
        });
    });

// var assert = require('chai').assert;
// var chai = require('chai');
// var chaiHttp = require('chai-http');
// chai.use(chaiHttp);
//
// // var app = "http://localhost:1337";
//
// const app = require('../app');
// var Snyt = require('../models/Snyt.model');
//
// describe('update/tilføj SNYT test', function () {
//
//     var newSnyt = new Snyt();
//     newSnyt.subject = 'Medicin emne REDIGERINGS TEST';
//     newSnyt.category = 'AC';
//     newSnyt.text = 'bla bla bla medicin';
//     newSnyt.user = 'NLJ';
//     newSnyt.created = "2017-11-13T09:41:20.029Z";
//     newSnyt.edok = "http://e-dok.dk/noget";
//
//     //gem en ny snyt
//     newSnyt.save(function(err, snyt) {
//         if(err) {
//             res.send('Error: ' + err.toString());
//         }
//         else{
//             console.log('GEMT!!');
//             // done();
//         }
//     });
//
//     it('Bliver redigeret',function () {
//         Snyt.find({subject: newSnyt.subject, category: newSnyt.category, text: newSnyt.text, user: newSnyt.user, created: newSnyt.created, edok: newSnyt.edok})
//             .exec(function (err,doc) {
//             if(err){
//                 throw err;
//             }
//             if(doc.length>0){
//                 console.log("fundet snyt" + doc.length);
//             }
//
//             Snyt.findOneAndUpdate({"_id":doc[0]._id},{"text": "REDIGERET TEKST"},function (editerr, editdoc) {
//                 if(editerr){
//                     console.log("redigerings error"+editerr);
//                 }
//
//                 console.log(editdoc);
//
//                 assert.not.equal(editdoc[0].text,doc[0].text);
//             })
//
//             // doc[0]._id
//         });
//     });
// });