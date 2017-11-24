var express = require('express'),
    mongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    rp = require('request-promise'),
    Snyt = require('./models/Snyt.model');

var mongoUrl = 'mongodb://snytfix:snytfix@ds115166.mlab.com:15166/snytplusplus';

var app = express();

app.use(express.static('public'));

mongoClient.connect(mongoUrl, function (err, db) {
    if(err) {
        throw err;
    }
    console.log("Connected successfully to server");
    app.Snyt = db.collection('Snyt');
    db.ensureIndex('subject', 'category', 'text', 'user','created','edok', function (err) {
        if (err) {
            throw err
        }
    });
});

mongoose.connect(mongoUrl, {
    useMongoClient: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('tiny'));

app.set('view engine', 'pug');

app.get('/',function (req,res) {

});



//Start it up!!! WOOP WOOP WOOP SNYT++ 4 lyfe
app.listen(1337);

module.exports = mongoClient;