/* jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SnytSchema = new Schema({
    text: String,
    user: String,
    created: {type: Date, default: Date.now},
    // notReadBy: []

});

module.exports = mongoose.model('subsnyts', SnytSchema);