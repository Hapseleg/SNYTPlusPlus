/*
Test at det er de rigtige værdier den gemmer
Validering
Test at den bliver gemt i db når man trykker opret
----
v2 billeder, login
 */



const assert = require('chai').assert;
const app = require('../app');

console.log(app().mongoUrl);
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