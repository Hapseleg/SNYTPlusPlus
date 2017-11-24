/*
Test at det er de rigtige værdier den gemmer
Validering
Test at den bliver gemt i db når man trykker opret
----
v2 billeder, login
 */

const equal = require('chai').equal;
const expect = require('chai').expect;
const app = require('../app');
var SNYT = require('../models/Snyt.model');

describe('App', function () {
    var newSnyt = new SNYT();
    SNYT.subject = 'Medicin emne';
    SNYT.category = 'AC';
    SNYT.text = 'bla bla bla medicin';
    SNYT.user = 'NLJ';
    SNYT.created = "2017-11-13T09:41:20.029Z";
    SNYT.edok = "http://e-dok.dk/noget";

    newSnyt.save(function(err, snyt) {
        if(err) {
            res.send('Error: ' + err.toString());
        }
    });

    console.log('GEMT!!');

    // var hentetSnyt = new SNYT;
    // SNYT.find({subject: newSnyt.subject, category: newSnyt.category, text: newSnyt.text, user: newSnyt.user, created: newSnyt.created, edok: newSnyt.edok}).exec(function (err,doc) {
    //     if(err){
    //         throw err;
    //     }
    //     else{
    //         hentetSnyt = doc;
    //     }
    // });
    // expect(newSnyt.subject).to.equal(hentetSnyt.subject);
    // expect(newSnyt.category).to.equal(hentetSnyt.category);
    // expect(newSnyt.text).to.equal(hentetSnyt.text);
    // expect(newSnyt.user).to.equal(hentetSnyt.user);
    // expect(newSnyt.created).to.equal(hentetSnyt.created);
    // expect(newSnyt.edok).to.equal(hentetSnyt.edok);
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