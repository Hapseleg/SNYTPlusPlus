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
    // var today = Date();
    // console.log("TODAY");
    // console.log(today);
    res.render('createSnyt');//, {date: today});
});

app.post('/opretsnyt',function (req,res) {
    var newSnyt = new Snyt();
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
app.get('/search', function(req, res) {
    Snyt.find({}).exec(function(err, doc) {
        if(err) {
            throw err;
        } else {
            res.json(doc);
        }
    });
});

app.get('/search/:text', function(req, res) {
    var reg = new RegExp(".*" + req.params.text + ".*", "i");
    Snyt.find({"$or":[{"subject": reg}, {"text": reg}]}).exec(function(err, doc) {
        if(err) {
            throw err;
        } else {
            res.json(doc);
        }
    });
});

app.post('/search', function(req, res) {
    var text = req.body.text;
    var dateFrom = new Date(req.body.dateFrom).toISOString();
    var dateTo = new Date(req.body.dateTo).toISOString();
    var read = req.body.read;
    var category = req.body.category;
    var regExText = new RegExp(".*" + text + ".*", "i");
    console.log(req.body);
    var readOption = {};
    var categoryOption = {};
    var textOption = {};
    if(read == "true") {
        readOption = {"readBy" : "userPlaceholder"};
    } else if(read == "false") {
        readOption = {"readBy" : {"$nin" : "userPlaceholder"}};
    }
    if(category.length > 0) {
        categoryOption = {"category" : category};
    }
    if(text.length > 0) {
        textOption = {
            "$or":
                [
                    {"subject": regExText},
                    {"text": regExText}
                ]
        };
    }
    Snyt.find(
        {"$and" :
            [
                categoryOption,
                textOption,
                {"created" : {
                    "$gte" : dateFrom,
                    "$lte" : dateTo
                }},
                readOption
            ]
        }).exec(function(err, doc) {
        if(err) {
            throw err;
        } else {
            res.json(doc);
        }
    });
});

//Start it up!!! WOOP WOOP WOOP SNYT++ 4 lyfe
app.listen(1337);

module.exports = mongoClient;