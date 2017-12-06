/*
Test at det er de rigtige værdier den gemmer
Validering
Test at den bliver gemt i db når man trykker opret
----
v2 billeder, login
 */

//TODO DENNE TEST FUNGERER MÅSKE IKKE MERE

// var assert = require('assert');
// const equals = require('chai').equals;
// var expect = require('chai').expect;
var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var app = "http://localhost:1337";

// const app = require('../app');
var SNYT = require('../models/Snyt.model');

describe('Create SNYT test', function () {
    var newSnyt = new SNYT();
    newSnyt.subject = 'Medicin emne';
    newSnyt.category = 'AC';
    newSnyt.text = 'bla bla bla medicin';
    newSnyt.user = 'NLJ';
    newSnyt.created = "2017-11-13T09:41:20.029Z";
    newSnyt.edok = "http://e-dok.dk/noget";

    it('gem en snyt',function () {
        newSnyt.save(function(err, snyt) {
            if(err) {
                res.send('Error: ' + err.toString());
            }
            else{
                console.log('GEMT!!');
                done();
            }
        });
    });

    it('check at den faktisk blev gemt i databasen', function () {
        SNYT.find({subject: newSnyt.subject, category: newSnyt.category, text: newSnyt.text, user: newSnyt.user, created: newSnyt.created, edok: newSnyt.edok}).exec(function (err,doc) {
            if(err){
                throw err;
            }
            assert.equal(newSnyt.subject,doc[0].subject);
            assert.equal(newSnyt.category,doc[0].category);
            assert.equal(newSnyt.text,doc[0].text);
            assert.equal(newSnyt.user,doc[0].user);
            assert.equal(newSnyt.created,doc[0].created);
            assert.equal(newSnyt.edok,doc[0].edok);
            console.log("HENTET SNYT:");
            done();
        });
    });
});




/*
Få fat i information fra ny SNYT
hent information om SNYT fra db by id
sammenlign informationer
 */
// describe('App',function () {
//     it('app should',function () {
//         assert.equal(app(), 'hello');
//     });
// });