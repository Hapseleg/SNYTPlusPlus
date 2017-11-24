/*
Test at det er de rigtige værdier den gemmer
Validering
Test at den bliver gemt i db når man trykker opret
----
v2 billeder, login
 */

const assert = require('chai').assert;
const app = require('../app');
var SNYT = require('../models/Snyt.model');

var testOpret = function () {
    var newSnyt = SNYT();
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




};


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