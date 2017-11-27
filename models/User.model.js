var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first: String,
    last: String,
    initials: String,
    email: String,
    password: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Users',UserSchema);