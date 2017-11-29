/*
Tjek at teksten bliver redigeret
 */

var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

// var app = "http://localhost:1337";

const app = require('../app');
var Snyt = require('../models/Snyt.model');

describe('Update SNYT test', function () {

    var newSnyt = new Snyt();
    newSnyt.subject = 'Medicin emne REDIGERINGS TEST';
    newSnyt.category = 'AC';
    newSnyt.text = 'bla bla bla medicin';
    newSnyt.user = 'NLJ';
    newSnyt.created = "2017-11-13T09:41:20.029Z";
    newSnyt.edok = "http://e-dok.dk/noget";

    //gem en ny snyt
    newSnyt.save(function(err, snyt) {
        if(err) {
            res.send('Error: ' + err.toString());
        }
        else{
            console.log('GEMT!!');
            // done();
        }
    });

    it('Bliver redigeret',function () {
        Snyt.find({subject: newSnyt.subject, category: newSnyt.category, text: newSnyt.text, user: newSnyt.user, created: newSnyt.created, edok: newSnyt.edok}).exec(function (err,doc) {
            if(err){
                throw err;
            }
            if(doc.length>0){
                console.log("fundet snyt" + doc.length);
            }

            Snyt.findOneAndUpdate({"_id":doc[0]._id},{"text": "REDIGERET TEKST"},function (editerr, editdoc) {
                if(editerr){
                    console.log("redigerings error"+editerr);
                }

                console.log(editdoc);

                assert.not.equal(editdoc[0].text,doc[0].text);
            })

            // doc[0]._id
        });
    });
});