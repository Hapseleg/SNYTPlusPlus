//***************************************************************************
// Module dependencies
//***************************************************************************

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    rp = require('request-promise'),
    config = require('config'),
    subSnyt = require('./models/Subsnyt.model'),
    Snyt = require('./models/Snyt.model'),
    User = require('./models/User.model');

//***************************************************************************
// Set up application
//***************************************************************************

//TODO Refactor error handling, så det sker på samme måde i alle ruter

var app = express();
app.use(express.static('public'));

// View options
app.set('view engine', 'pug');

//---------------------------------------
// MongoDB / Mongoose setup

// config.DBHost has mongoUrl information.
// if a test database is necessary, we need to change the DBHost in /config/test.json && make sure our tests sets process.env.NODE_ENV = 'test'
var mongoUrl = config.DBHost; 
mongoose.Promise = global.Promise;

// Connect to the mongoDB
mongoose.connect(mongoUrl, {
    useMongoClient: true
});

// Connection message
mongoose.connection.on('connected', function() {
    console.log('Connected succesfully to mongodb server: ' + mongoUrl);
});

// Error message
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

// Disconnect message
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose connection disconnected');
});

//***************************************************************************
// MIDDLEWARE
//***************************************************************************

app.use(bodyParser.urlencoded({extended:true}));

// If it's a test don't show morgan logging.
if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('tiny'));
}

//---------------------------------
// Cookie setup

app.use(cookieParser());
app.use(cookieSession({
    name:'session',
    keys:['hejKaj123'],//hash seed
    maxAge: 8*60*60*1000 //(8 time * 60 minutter * 60 sekunder * 1000 mili) = 8 timer i mili sek
}));
//---------------------------------

// Are we authenticated?
app.use(function(req,res,next){
    if(req.session.loggedIn){
        res.locals.authenticated = true;
        User.findOne({"_id": mongoose.Types.ObjectId(req.session.loggedIn)},
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

// Are we authenticated as an admin?
app.use(function(req, res, next) {
    if(req.session.adminLoggedIn) {
        res.locals.authenticatedAdmin = true;
    } else {
        res.locals.authenticatedAdmin = false;
    }
    next();
});

//***************************************************************************
// Routes
//***************************************************************************

/* 
 * Frontpage get route
*/
app.get('/',function (req,res) {
    res.render('index');
});

/*
 * Login post route
 *
 * Recieve login data from user and try to find user in mongo
 * if found redirect to the login page
 * else create UNF page
 */
app.post('/',function (req,res) {
    User.findOne({email: req.body.user.email, password: req.body.user.password}, function (err,doc) {
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

/*
 * Logout route
 */
app.get('/logout',function (req,res) {
    req.session.loggedIn = null;
    res.redirect('/');
});

//----------------------------------------------
// SNYT CRUD routes

/*
 * Render create snyt screen
 */
app.get('/opretsnyt', function (req,res) {
    res.render('createSnyt');
});

/*
 * Create new snyt route
 *
 * Recieve SNYT data from user and create the document in mongo
 * Then redirect to /
 */
app.post('/opretsnyt',function (req,res) {
    var newSnyt = new Snyt();
    newSnyt.subject = req.body.snyt.subject;
    newSnyt.category = req.body.snyt.category;
    newSnyt.text = req.body.snyt.text;
    newSnyt.user = req.body.snyt.user;
    newSnyt.created = req.body.snyt.created;
    newSnyt.edok = req.body.snyt.edok;
    // var AddAllUsersToNewSnyt = function() {
    //     User.find().exec().then(function (user) {
    //         var a = [];
    //         for (var j in user) {
    //             console.log(j + '_:_ '+user[j]);
    //             a.push(user[j]._id);
    //         }
    //         newSnyt.notReadBy = a;
    //     });
    // }();

    console.log(req.body.snyt.created);

    newSnyt.save(function (err, snyt) {
       if(err){
           res.send('Error:'+err.toString());
       }
       // console.log(snyt.notReadBy);
    });
    res.redirect('/');
});
app.get('/updateSnyt/:id', function (req,res) {
    console.log(req.params.id);
    res.render('updateSnyt', {snytid: req.params.id});
});
app.post('/updateSnyt/:id',function (req,res) {
    var newsubsnyt = new subSnyt();
    newsubsnyt.text = req.body.subsnyt.text;
    newsubsnyt.user = req.body.subsnyt.user;
    newsubsnyt.created = req.body.subsnyt.created;
    console.log(newsubsnyt);
    console.log(req.params.id);
    console.log(req.body.subsnyt);

    newsubsnyt.save(function (err, subsnyt) {
        if(err){
            res.send('Error:'+err.toString());
        }
        console.log('her er lorten');
        console.log(subsnyt);
        console.log(req.params.id);
        Snyt.findOneAndUpdate({_id: req.params.id},{$push: {idSubSnyts: subsnyt._id }}

            );


    });
    res.redirect('/');
});
/*
 * SNYT Read and mark as læsekvitteret routes
 */
app.route('/snyt/:id')
    //TODO
    // GET - Read SNYT
    .get(function (req, res) {
        let userID = req.session.loggedIn;
        let notUserRead = true;
        Snyt.findById(req.params.id).exec().then(function(doc) {
            if(doc.readBy.includes(userID)){
                notUserRead = false;
            }
            res.render('showSnyt', {snyt: doc, userHasNotRead: notUserRead});
        }).catch(function (err) {
            console.log('du er blevet snyt hehe (: \n'+err);
            res.send('Error:' + err.toString());
        });
    });


// POST -  Mark a SNYT as læsekvitteret -> redirect to /
app.post('/snyt/:id',function (req,res) {
    let userID = req.session.loggedIn;
    console.log("her er lorten");
    console.log(req.params.id);
    Snyt.findOneAndUpdate({_id: req.params.id}, {$push: {readBy: userID}})
        // .exec()
        .catch(function (err) {
            console.log('du er blevet snyt hehe (: \n'+err);
            res.send('\n \n Error:' + err.toString());
        });
    Snyt.findOne({_id: req.params.id}).exec().then(function (doc) {
        console.log(doc.readBy);
    }).catch(function (err) {
        console.log('\n mere snyt \n' + err);
    });

    res.redirect('/');
});

/*
 *
 */
app.post('/editSnyt',function (req, res) {
    var newSnyt = new Snyt();
    newSnyt.subject = req.body.snyt.subject;
    newSnyt.category = req.body.snyt.category;
    newSnyt.text = req.body.snyt.text;
    newSnyt.user = req.body.snyt.user;
    newSnyt.created = req.body.snyt.created;
    newSnyt.edok = req.body.snyt.edok;
    newSnyt._id = req.body.snyt._id;

    Snyt.findOneAndUpdate({"_id":newSnyt._id},{"subject": newSnyt.subject, "category" : newSnyt.category, "text" : newSnyt.text, "user":newSnyt.user,"created":newSnyt.created,"edok":newSnyt.edok}, {new:true}).exec().then(function(doc) {
        console.log(doc);
        var docarray = [];
        docarray.push(doc);

        res.render('showSnyt',{snyt:docarray});
    }).catch(function (err) {
        console.log(err);
    });
});

/*
 *
 */
app.get('/editSnyt/:id',function (req, res) {
    Snyt.find({_id: req.params.id}).exec(function (err,doc) {
        res.render('editSnyt',{snyt:doc});
    });
});

//----------------------------------------------
// Search routes

/*
 * Alle snyt
 */
app.get('/search', function(req, res) {
    Snyt.find({}).sort({"created" : -1}).exec(function(err, doc) {
        if(err) {
            throw err;
        } else {
            res.json(doc);
        }
    });
});

/*
 * Almindelig søgning
 */
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

/*
 * Avanceret søgning
 */
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

//----------------------------------------------
// Admin routes

/*
 * Get admin side (login side hvis man ikke er authenticated)
 */
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

/*
 * Opret ny bruger i systemet
 */
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

    // var AddNewUserToAllSnyts = function() {
    //     Snyt.find().exec().then(function (snyt) {
    //         for (var n in snyt) {
    //             console.log(n + '_:_ '+snyt[n]);
    //             snyt[n].notReadBy.push(newUser[n]._id);
    //         }
    //     });
    // }();

    newUser.save(function (err, user) {
        if(err){
            res.send('Error:'+err.toString());
        }
    });

    res.redirect('/admin');
});

/*
 * Rediger en bruger
 */
app.put('/admin', function(req, res) {
    var returnJson = {
        errors : [],
        message : null,
        data : null
    };
    User.findById(mongoose.Types.ObjectId(req.body.id), function(err, u) {
        if(err) {
            returnJson.errors.push(err);
        }
        console.log(u);
        if(!u) {
            returnJson.errors.push(new Error("Ingen bruger"));
        }
        u.firstName = req.body.firstName;
        u.lastName = req.body.lastName;
        u.password = req.body.password;
        u.email = req.body.email;
        u.initials = req.body.initials;
        u.save(function(err) {
            if(err) {
                returnJson.errors.push(err);
                returnJson.message = "Something went wrong";
            } else {
                returnJson.message = "success";
            }
            res.redirect("/admin", returnJson);
        });
    });
});

/*
 * Slet en bruger
 */
app.delete('/admin', function(req, res) {

    // var removeOldUserFromAllSnyts = function() {
    //     Snyt.find().exec().then(function (snyt) {
    //         for (var nn in snyt) {
    //             console.log(nn + '_:_ '+snyt[nn]);
    //             snyt[nn].notReadBy.remove(_id));
    //         }
    //     });
    // }();

    User.find({"_id" : mongoose.Types.ObjectId(req.body.id)}).remove().exec();
    res.render('admin');
});

/*
 * Login som admin
 */
app.post('/admin/login', function(req, res) {
    var adminUsername = "administrator";
    var adminPassword = "pokemon";

    if(req.body.adminUsername == adminUsername && req.body.adminPassword == adminPassword) {
        req.session.adminLoggedIn = "thisIsAdmin";
    }
    res.redirect('/admin');
});

/*
 * Log out as admin
 */
app.get('/admin/logout', function(req, res) {
    req.session.adminLoggedIn = null;
    res.redirect('/admin');
});

/*
 * Hjælpefunktion til at få ID på en bruger med email og password i POST
 */
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

//**********************************************************************
// Listen(), exports and test misc
//**********************************************************************
 
//Start it up!!! WOOP WOOP WOOP SNYT++ 4 lyfe
//if (!module.parent) {
//    app.listen(1337);
//    console.log("Listening on port 1337...");
//}

// We need to use the returned value from listen() to be able to close it again.
var server = app.listen(1337);

// Used for tests to shut down the server again.
var shutdown = function() {
    console.log("Server shutting down...");
    mongoose.connection.close();
    server.close();
};

module.exports = {
    app: app,
    shutdown: shutdown
};
