/* jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./User.model');

// var s = function() {
//     User.find().exec().then(function (user) {
//         var a =[];
//         for (var j in user) {
//             console.log(j + '_:_ '+user[j]);
//         }
//         return user;
//     });
// };
//
// var ss = function () {
//     var a = [];
//     for(var i in s()){
//         console.log(i)
//     }
// };
var SnytSchema = new Schema({
    subject: String,
    category: String,
    text: String,
    user: String,
    created: {type: Date, default: Date.now},
    edok : String,
    notReadBy: {type: Array/* default: s()*/}
});

module.exports = mongoose.model('Snyts', SnytSchema);