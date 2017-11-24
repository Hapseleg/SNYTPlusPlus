/* jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SnytSchema = new Schema({
    subject: String,
    category: String,
    text: String,
    user: String,
    created: {type: Date, default: Date.now},
    edok : String
});

module.exports = mongoose.model('Snyt', SnytSchema);