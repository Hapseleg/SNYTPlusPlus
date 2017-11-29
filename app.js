var express = require('express'),
    mongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    rp = require('request-promise'),
    Snyt = require('./models/Snyt.model'),
    User = require('./models/User.model');

var mongoUrl = 'mongodb://snytfix:snytfix@ds115166.mlab.com:15166/snytplusplus';
mongoose.Promise = global.Promise;

var app = express();

app.use(express.static('public'));
mongoose.Promise = global.Promise;

mongoClient.connect(mongoUrl, function (err, db) {
    if(err) {
        throw err;
    }
    console.log("Connected successfully to server");
    app.Snyt = db.collection('snyts');
    app.users = db.collection('users');
    // db.ensureIndex('subject', 'category', 'text', 'user','created','edok', function (err) {
        if (err) {
            throw err
        }
    // });
});

mongoose.connect(mongoUrl, {
    useMongoClient: true
});
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(cookieSession({
    name:'session',
    keys:['hejKaj123'],//hash seed
    maxAge: 8*60*60*1000 //(8 time * 60 minutter * 60 sekunder * 1000 mili) = 8 timer i mili sek
}));

app.use(function(req,res,next){
    if(req.session.loggedIn){
        res.locals.authenticated = true;
        app.users.findOne({"_id": new ObjectId(req.session.loggedIn)},
            function (err,doc) {
                if(err){
                    return next(err)
                }
                else{
                    res.locals.me = doc;
                    next()
                }
            })
    }
    else{
        res.locals.authenticated = false;
        next();
    }

    //TODO KUN TIL TEST HVIS DU IKKE HAR ET LOGIN!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // res.locals.authenticated = true;
    // next();
});

app.set('view engine', 'pug');

app.use(function(req, res, next) {
    if(req.session.adminLoggedIn) {
        res.locals.authenticatedAdmin = true;
    } else {
        res.locals.authenticatedAdmin = false;
    }
    next();
});

app.get('/',function (req,res) {
    Snyt.find({}).exec().then(function(snyt) {
        //TODO tilføj så man kan se hvilke man har læse kvitteret
        //TODO sorter efter dato? Eller burde db ikke være sorteret efter det?
        res.render('index',{allSnyt:snyt});
    }).catch(function (err) {
        console.log(err);
    });




    // res.render('index');
});

app.post('/',function (req,res) {
    app.users.findOne({email: req.body.user.email, password: req.body.user.password}, function (err,doc) {
        if(err){
            return next(err)
        }
        else if(!doc){
            return res.send('<p>User not found</p>');
        }
        else{
            req.session.loggedIn = doc._id;
            // res.send(doc);
            res.redirect('/');
        }
    });
});

app.get('/logout',function (req,res) {
    req.session.loggedIn = null;
    res.redirect('/');
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

    console.log(req.body.snyt.created);

    newSnyt.save(function (err, snyt) {
       if(err){
           res.send('Error:'+err.toString());
       }
    });
    res.redirect('/');
});
app.post('/snyt/:id',function (req,res) {
    console.log(req.session.loggedIn);
    Snyt.find({_id: req.params.id}).exec().then(function(doc) {
        /*
         * find eget user _id.
         * set user til læsekvitter = true
         */
    }).catch(function (err) {
        console.log('du er blevet snyt hehe (: \n'+err);
    });
    res.redirect('/');
});

app.get('/snyt/:id', function (req, res) {
    Snyt.find({_id: req.params.id}).exec().then(function(doc) {
        res.render('showSnyt', {snyt: doc});
    }).catch(function (err) {
        console.log('du er blevet snyt hehe (: \n'+err);
    });
});
app.get('/search', function(req, res) {
    Snyt.find({}).sort({"created" : -1}).exec(function(err, doc) {
        if(err) {
            throw err;
        } else {
            res.json(doc);
        }
    });
});

app.get('/search/:text', function(req, res) {
    var reg = new RegExp(".*" + req.params.text + ".*", "i");
    Snyt.find({"$or":[{"subject": reg}, {"text": reg}]}).sort({"created" : -1}).exec(function(err, doc) {
        if(err) {
            throw err;
        } else {
            res.json(doc);
        }
    });
});

app.post('/search', function(req, res) {
    var text = req.body.text;
    var dateFrom = new Date(req.body.dateFrom);
    var dateTo = new Date(req.body.dateTo);
    dateTo.setHours(24);
    dateTo.setMinutes(59);
    dateTo.setSeconds(59);
    dateFrom = dateFrom.toISOString();
    dateTo = dateTo.toISOString();
    var read = req.body.read;
    var category = req.body.category;
    var regExText = new RegExp(".*" + text + ".*", "i");
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
        }).sort({"created" : -1}).exec(function(err, doc) {
        if(err) {
            throw err;
        } else {
            res.json(doc);
        }
    });
});

// Get admin side (login side hvis man ikke er authenticated)
app.get('/admin', function(req, res) {
    var allUsers = null;
    var errors = null;
    User.find({}).exec(function(err, doc) {
        if(doc) {
            allUsers = doc;
        } else {
            error = "Der skete en fejl, prøv at genindlæse siden"
        }
        if(err) {
            error = err;
        }
        res.render('admin', {allUsers : allUsers, errors : errors});
    });
});

// Opret ny bruger i systemet
app.post('/admin', function(req, res) {
    var errors = [];
    User.find({"email" : req.body.user.email}).exec(function(err, doc) {
        if(err) {
            errors.push(err);
        }
        if(doc) {
            errors.push("Bruger med denne email eksisterer allerede");
        }
    });
    User.find({"initials" : req.body.user.initials}).exec(function(err, doc) {
        if(err) {
            errors.push(err);
        }
        if(doc) {
            errors.push("Bruger med disse initialer eksisterer allerede");
        }
    });
    if(errors.length > 0) {
        res.json(errors);
    }
    var newUser = new User();
    newUser.first = req.body.user.first;
    newUser.last = req.body.user.last;
    newUser.initials = req.body.user.initials;
    newUser.email = req.body.user.email;
    newUser.password = req.body.user.password;

    newUser.save(function (err, user) {
        if(err){
            res.send('Error:'+err.toString());
        }
    });

    res.redirect('/admin');
});

// Rediger en bruger
app.put('/admin', function(req, res) {
    User.findById(ObjectId(req.body.id), function(err, u) {
        if(err) {
            res.send('Error:'+err.toString());
        }
        console.log(u);
        if(!u) {
            throw new Error("Ingen bruger");
        }
        u.firstName = req.body.firstName;
        u.lastName = req.body.lastName;
        u.password = req.body.password;
        u.email = req.body.email;
        u.initials = req.body.initials;
        u.save(function(err) {
            if(err) {
                throw err;
            }
            res.redirect("/admin");
        });
    });
});

// Slet en bruger
app.delete('/admin', function(req, res) {
    User.find({"_id" : ObjectId(req.body.id)}).remove().exec();
    res.render('admin');
});

// Login som admin
app.post('/admin/login', function(req, res) {
    var adminUsername = "administrator";
    var adminPassword = "pokemon";

    if(req.body.adminUsername == adminUsername && req.body.adminPassword == adminPassword) {
        req.session.adminLoggedIn = "thisIsAdmin";
    }
    res.redirect('/admin');
});

app.get('/admin/logout', function(req, res) {
    req.session.adminLoggedIn = null;
    res.redirect('/admin');
});

// Hjælpefunktion til at få ID på en bruger med email og password i POST
app.post('/admin/user', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({"email" : email, "password" : password}).exec(function(err, doc) {
        if(!doc) {
            throw new Error("Ingen bruger");
        }
        if(err) {
            throw err;
        }
        res.json(doc._id);
    });
});

app.get('/editSnyt/:id',function (req, res) {
    Snyt.find({_id: req.params.id}).exec(function (err,doc) {
        res.render('editSnyt',{snyt:doc});
    });
});
app.post('/editSnyt',function (req, res) {
    var newSnyt = new Snyt();
    newSnyt.subject = req.body.snyt.subject;
    newSnyt.category = req.body.snyt.category;
    newSnyt.text = req.body.snyt.text;
    newSnyt.user = req.body.snyt.user;
    newSnyt.created = req.body.snyt.created;
    newSnyt.edok = req.body.snyt.edok;
    newSnyt._id = req.body.snyt._id;

    // Snyt.findOneAndUpdate({"_id":newSnyt._id},{"subject": newSnyt.subject, "category" : newSnyt.category, "text" : newSnyt.text, "user":newSnyt.user,"created":newSnyt.created,"edok":newSnyt.edok},function (err, doc) {
    //     if(err){
    //         console.log("redigerings error"+err);
    //     }
    //
    //     console.log(typeof doc);
    //     console.log(doc);
    //     res.render('showSnyt', {snyt: doc});
    //     // console.log(newSnyt);
    //     // res.render('showSnyt', {snyt: doc});
    // });

    // Snyt.findOneAndUpdate({"_id":newSnyt._id},{"subject": newSnyt.subject, "category" : newSnyt.category, "text" : newSnyt.text, "user":newSnyt.user,"created":newSnyt.created,"edok":newSnyt.edok}, {returnNewDocument:true}).exec().then(function (doc) {
    //     res.render('showSnyt', {snyt: doc});
    // }).catch(function (err) {
    //     console.log(err);
    // });

    Snyt.findOneAndUpdate({"_id":newSnyt._id},{"subject": newSnyt.subject, "category" : newSnyt.category, "text" : newSnyt.text, "user":newSnyt.user,"created":newSnyt.created,"edok":newSnyt.edok}, {new:true}).exec().then(function(doc) {
        console.log(doc);
        var docarray = [];
        docarray.push(doc);

        res.render('showSnyt',{snyt:docarray});
    }).catch(function (err) {
        console.log(err);
    });

    // Snyt.find({_id: req.params.id}).exec().then(function(doc) {
    //     res.render('showSnyt', {snyt: doc});
    // }).catch(function (err) {
    //     console.log('du er blevet snyt hehe (: \n'+err);
    // });


});

//Start it up!!! WOOP WOOP WOOP SNYT++ 4 lyfe
if(!module.parent){
    app.listen(1337);
}

// module.exports = mongoClient;
module.exports = app;
