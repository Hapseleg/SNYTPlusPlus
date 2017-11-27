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
mongoose.Promise = global.Promise;

mongoClient.connect(mongoUrl, function (err, db) {
    if(err) {
        throw err;
    }
    console.log("Connected successfully to server");
    app.Snyt = db.collection('snyts');
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
    res.render('index');
});

app.get('/opretsnyt', function (req,res) {
    res.render('createSnyt');
});

app.post('/opretsnyt',function (req,res) {
    var newSnyt = new SNYT();
    newSnyt.subject = req.body.snyt.subject;
    newSnyt.category = req.body.snyt.category;
    newSnyt.text = req.body.snyt.text;
    newSnyt.user = req.body.snyt.user;
    newSnyt.created = req.body.snyt.created;
    newSnyt.edok = req.body.snyt.edok;



    newSnyt.save(function (err, snyt) {
       if(err){
           res.send('Error:'+err.toString());
       }
    });

    res.redirect('/');
});

app.get('/snyt/:id', function (req, res) {
    Snyt.find({_id: req.params.id}).exec().then(function(snyt) {
        res.json(snyt);
    }).catch(function (err) {
        console.log('du er blevet snyt hehe (: '+err);
    });
});


//Start it up!!! WOOP WOOP WOOP SNYT++ 4 lyfe
app.listen(1337);

module.exports = mongoClient;