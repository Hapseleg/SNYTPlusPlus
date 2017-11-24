/*
Test at det er de rigtige værdier den gemmer
Validering
Test at den bliver gemt i db når man trykker opret
----
v2 billeder, login
 */

var assert = require('assert');
const equals = require('chai').equals;
var expect = require('chai').expect;

const app = require('../app');
var SNYT = require('../models/Snyt.model');

describe('Create SNYT test', function () {
    it('fuck test first',function () {
        var newSnyt = new SNYT();
        newSnyt.subject = 'Medicin emne';
        newSnyt.category = 'AC';
        newSnyt.text = 'bla bla bla medicin';
        newSnyt.user = 'NLJ';
        newSnyt.created = "2017-11-13T09:41:20.029Z";
        newSnyt.edok = "http://e-dok.dk/noget";

        newSnyt.save(function(err, snyt) {
            if(err) {
                res.send('Error: ' + err.toString());
            }
        });

        console.log('GEMT!!');

        var hentetSnyt = new SNYT();
        // SNYT.find({subject: newSnyt.subject, category: newSnyt.category, text: newSnyt.text, user: newSnyt.user, created: newSnyt.created, edok: newSnyt.edok}).exec(function (err,doc) {
        SNYT.find({subject: newSnyt.subject}).exec(function (err,doc) {
            if(err){
                throw err;
            }
            else{


                // console.log(doc);
                // hentetSnyt = doc;
            }
            // console.log("DOC:");
            // console.log(doc[0]);
            // hentetSnyt.subject = doc[0].subject;
            // hentetSnyt.category = doc[0].category;
            // hentetSnyt.text = doc[0].text;
            // hentetSnyt.user = doc[0].user;
            // hentetSnyt.created = doc[0].created;
            // hentetSnyt.edok = doc[0].edok;

            assert.equal(newSnyt.subject,doc[0].subject);
            assert.equal(newSnyt.category,doc[0].category);
            assert.equal(newSnyt.text,doc[0].text);
            assert.equal(newSnyt.user,doc[0].user);
            assert.equal(newSnyt.created,doc[0].created);
            assert.equal(newSnyt.edok,doc[0].edok);
        });
        console.log("HENTET SNYT:");
        console.log(hentetSnyt);
        // expect(newSnyt.subject).to.equal(hentetSnyt.subject);
        // expect(newSnyt.category).to.equal(hentetSnyt.category);
        // expect(newSnyt.text).to.equal(hentetSnyt.text);
        // expect(newSnyt.user).to.equal(hentetSnyt.user);
        // expect(newSnyt.created).to.equal(hentetSnyt.created);
        // expect(newSnyt.edok).to.equal(hentetSnyt.edok);
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