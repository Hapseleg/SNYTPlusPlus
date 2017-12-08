//***************************************************************************
// Module dependencies
//***************************************************************************

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    multer = require('multer'),
    upload = multer({ dest: 'public/uploads'}),rp = require('request-promise'),
    config = require('config'),
    SubSnyt = require('./models/Subsnyt.model'),
    Snyt = require('./models/Snyt.model'),
    User = require('./models/User.model');

//***************************************************************************
// Set up application
//***************************************************************************

//TODO Refactor error handling, så det sker på samme måde i alle ruter

var app = express();
app.use(express.static('public'));
app.use(express.static('uploads'));

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
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

// Disconnect message
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose connection disconnected');
});

//***************************************************************************
// MIDDLEWARE
//***************************************************************************

app.use(bodyParser.urlencoded({extended: true}));

// If it's a test don't show morgan logging.
if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('tiny'));
}

//---------------------------------
// Cookie setup

app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['hejKaj123'],//hash seed
    maxAge: 8 * 60 * 60 * 1000 //(8 time * 60 minutter * 60 sekunder * 1000 mili) = 8 timer i mili sek
}));
//---------------------------------

// Are we authenticated?
app.use(function(req, res, next) {
    if(req.session.loggedIn) {
        res.locals.authenticated = true;
        User.findOne({'_id': mongoose.Types.ObjectId(req.session.loggedIn)},
            function(err, doc) {
                if(err) {
                    return next(err);
                }
                else {
                    res.locals.me = doc;
                    next();
                }
            });
    }
    else {
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
app.get('/', function(req, res) {
    res.render('index');
});

/*
 * Login post route
 *
 * Recieve login data from user and try to find user in mongo
 * if found redirect to the login page
 * else create UNF page
 */
app.post('/', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: null
    };
    User.findOne({email: req.body.user.email, password: req.body.user.password}, function(err, doc) {
        if(err) {
            returnJson.errors.push('Der skete en fejl da vi prøvede at logge ind');
        }
        else if(!doc) {
            returnJson.errors.push('Forkert email og/eller password');
            returnJson.message = 'Der gik noget galt';
        }
        else {
            req.session.loggedIn = doc._id;
            returnJson.message = 'Du blev logget ind';
        }
        res.render('index', returnJson);
    });
});

/*
 * Logout route
 */
app.get('/logout', function(req, res) {
    req.session.loggedIn = null;
    res.redirect('/');
});

//----------------------------------------------
// SNYT CRUD routes

/*
 * Render create snyt screen
 */
app.get('/opretsnyt', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: {
            date: null
        }
    };
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if(dd < 10) {
        dd = '0' + dd;
    }
    if(mm < 10) {
        mm = '0' + mm;
    }

    returnJson.data.date = yyyy + '-' + mm + '-' + dd;

    res.render('createSnyt', returnJson);
});

/*
 * Create new snyt route
 *
 * Recieve SNYT data from user and create the document in mongo
 * Then redirect to /
 */
//app.post('/opretsnyt',upload.single('pic'),function (req,res) {
app.post('/opretsnyt',upload.array('pic'),function (req,res) {
    // console.log(req.files);
    var returnJson = {
        errors : [],
        message : null,
        data : null
    };
    //console.log(req.body);
    var newSnyt = new Snyt();
    newSnyt.subject = req.body.snyt.subject;
    newSnyt.category = req.body.snyt.category;
    newSnyt.text = req.body.snyt.text;
    newSnyt.user = req.body.snyt.user;
    newSnyt.created = req.body.snyt.created;
    newSnyt.edok = req.body.snyt.edok;


    // newSnyt.pictures.push({filename: req.file.filename, orgName: req.file.originalname});
    for(p in req.files){
        newSnyt.pictures.push(req.files[p].filename);
    }

    newSnyt.save(function(err, snyt) {
        if(err) {
            returnJson.errors.push('Der skete en fejl da vi forsøgte at gemme din SNYT');
            returnJson.message = 'Der gik noget galt';
            res.render('createSnyt', returnJson);
        } else {
            returnJson.message = 'SNYT blev gemt';
            res.redirect('/');
        }
    });
});
app.get('/updateSnyt/:id', function(req, res) {
    //mangler sikkerhed: man kan stadig bypass ved at gå på url'en (altså hvis man ikke er den bruger der har oprettet SNYT'en) men vi synes ikke det er nødvendigt..

    var returnJson = {
        errors: [],
        message: null,
        data: {
            snytid: null,
            date: null
        }
    };
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if(dd < 10) {
        dd = '0' + dd;
    }
    if(mm < 10) {
        mm = '0' + mm;
    }

    returnJson.data.date = yyyy + '-' + mm + '-' + dd;
    returnJson.data.snytid = req.params.id;

    res.render('updateSnyt', returnJson);
});

app.post('/updateSnyt/:id', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: {
            snyt: null
        }
    };
    var newsubsnyt = new SubSnyt();
    newsubsnyt.text = req.body.subsnyt.text;
    newsubsnyt.user = req.body.subsnyt.user;
    newsubsnyt.created = req.body.subsnyt.created;

    newsubsnyt.save(function(err, subsnyt) {
        if(err) {
            returnJson.errors.push('Der skete en fejl da vi forsøgte at gemme din opdatering');
        }

        Snyt.findOneAndUpdate({_id: req.params.id}, {$push: {idSubSnyts: subsnyt.id}}).exec(function(err, doc) {
            res.redirect('/snyt/' + req.params.id);
        })
            .catch(function(err) {
                returnJson.errors.push('Der skete en fejl da vi forsøgte at gemme din opdatering');
                returnJson.messge = 'Der gik noget galt';
                res.render('showSnyt', returnJson);
            });
    });
});

/*
 * SNYT Read and mark as læsekvitteret routes
 */
app.route('/snyt/:id').get(function (req, res) {
    var returnJson = {
        errors : [],
        message : null,
        data : {
            userID : req.session.loggedIn,
            notUserRead : true,
            hasSubSnyt : false,
            snyt : null,
            subSnytsInSnyt : null
        }
    };
    Snyt.findById(req.params.id).exec().then(function(doc) {
        if(doc.readBy.includes(returnJson.data.userID)){
            returnJson.data.notUserRead = false;
        }
        if(doc.idSubSnyts.length>0){
            returnJson.data.hasSubSnyt = true;
        }
        SubSnyt.find({'$or':[{'_id':doc.idSubSnyts}]}).exec(function (err, subdoc) {
            if(err){
                returnJson.errors.push('Der skete en fejl under inlæsning af denne SNYT');
                returnJson.message = 'Der gik noget galt';
            }
            returnJson.data.subSnytsInSnyt = subdoc;
            returnJson.data.snyt = doc;
            console.log(doc);res.render('showSnyt', returnJson);
        });
    }).catch(function (err) {
        returnJson.errors.push('Der skete en fejl under inlæsning af denne SNYT');
        returnJson.message = 'Der gik noget galt';
        res.render('showSnyt', returnJson);
    });
});

// POST -  Mark a SNYT as læsekvitteret -> redirect to /
app.post('/snyt/:id', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: null
    };
    let userID = req.session.loggedIn;
    Snyt.findOneAndUpdate({_id: req.params.id}, {$push: {readBy: userID}})
    // .exec()
        .catch(function(err) {
            returnJson.errors.push('Der skete en fejl da vi forsøgte at gemme din læsekvittering');
            returnJson.message = 'Der gik noget galt';
            res.render('showSnyt', returnJson);
        });
    // Snyt.findOne({_id: req.params.id}).exec().then(function (doc) {
    //     console.log(doc.readBy);
    // }).catch(function (err) {
    //     console.log('\n mere snyt \n' + err);
    // });

    res.redirect('/snyt/' + req.params.id);
});

/*
 *
 */
app.post('/editSnyt',upload.array('pic'), function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: {
            snyt: null
        }
    };

    // TODO SIkkerheds tjek kan eventuelt gøres som under dette

    //  if(res.locals.me.initials != req.body.snyt.user) {
    //      returnJson.errors.push("Du kan ikke redigere i denne SNYT, da det ikke er dig der har lavet den")
    //      res.redirect('/snyt/' + req.body.snyt._id)
    //  }

    var newSnyt = new Snyt();
    newSnyt.subject = req.body.snyt.subject;
    newSnyt.category = req.body.snyt.category;
    newSnyt.text = req.body.snyt.text;
    newSnyt.user = req.body.snyt.user;
    newSnyt.created = req.body.snyt.created;
    newSnyt.edok = req.body.snyt.edok;
    newSnyt._id = req.body.snyt._id;


    // 	Snyt.findOneAndUpdate({'_id': newSnyt._id}, {
    // 		'subject': newSnyt.subject,
    // 		'category': newSnyt.category,
    // 		'text': newSnyt.text,
    // 		'user': newSnyt.user,
    // 		'created': newSnyt.created,
    // 		'edok': newSnyt.edok
    // 	}, {new: true}).exec().then(function(doc) {
    // 		res.redirect('/snyt/' + req.body.snyt._id);
    // 	}).catch(function(err) {
    // 		returnJson.errors.push('Der skete en fejl da vi forsøgte at gemme din redigering');
    // 		returnJson.message = 'Der gik noget galt';
    // 		res.render('showSnyt', returnJson);
    // 	});
    // }
    // console.log(req.files)
    for(p in req.files){
        newSnyt.pictures.push(req.files[p].filename);
    }

    Snyt.findOneAndUpdate({"_id":newSnyt._id},{"subject": newSnyt.subject, "category" : newSnyt.category, "text" : newSnyt.text, "user":newSnyt.user,"created":newSnyt.created,"edok":newSnyt.edok,$push: {pictures: newSnyt.pictures[0]}}, {new:true}).exec().then(function(doc) {
        //TODO kan kun tilføje et billede af gangen pga hvis man skriver $push: {pictures: newSnyt.pictures} smider den selve arrayet ind i picture array'et der er i databasen (fremfor det der er indeni arrayet)


        //sikkerheds tjek om initialer passer med dem der har lavet SNYT'en
        // console.log("FINDONE I EDITSNYT POST:");
        // console.log(res.locals.me.initials == doc.user);
        if(res.locals.me.initials == doc.user){
            returnJson.data.snyt = doc;
            // console.log(returnJson.data);
            res.render('showSnyt', returnJson);
        }
        else{
            res.redirect('/snyt/' + req.body.snyt._id);
        }

    }).catch(function (err) {
        returnJson.errors.push("Der skete en fejl");
        res.redirect('/snyt/' + req.body.snyt._id);
    });
});
// app.post('/editSnyt', function(req, res) {
// 	var returnJson = {
// 		errors: [],
// 		message: null,
// 		data: {
// 			snyt: null
// 		}
// 	};
//
//     //sikkerheds tjek om initialer passer med dem der har lavet SNYT'en
//
//         var newSnyt = new Snyt();
//         newSnyt.subject = req.body.snyt.subject;
//         newSnyt.category = req.body.snyt.category;
//         newSnyt.text = req.body.snyt.text;
//         newSnyt.user = req.body.snyt.user;
//         newSnyt.created = req.body.snyt.created;
//         newSnyt.edok = req.body.snyt.edok;
//         newSnyt._id = req.body.snyt._id;
//
// 		Snyt.findOneAndUpdate({'_id': newSnyt._id}, {
// 			'subject': newSnyt.subject,
// 			'category': newSnyt.category,
// 			'text': newSnyt.text,
// 			'user': newSnyt.user,
// 			'created': newSnyt.created,
// 			'edok': newSnyt.edok
// 		}, {new: true}).exec().then(function(doc) {
// 			if(me.initials == newSnyt.user){
//                 res.redirect('/snyt/' + req.body.snyt._id);
// 			}
// 		}).catch(function(err) {
// 			returnJson.errors.push('Der skete en fejl da vi forsøgte at gemme din redigering');
// 			returnJson.message = 'Der gik noget galt';
// 			res.render('showSnyt', returnJson);
// 		});
// 	});

/*
 *
 */
app.get('/editSnyt/:id', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: {
            snyt: null
        }
    };
    Snyt.findById(req.params.id).exec().then(function(doc) {
        //sikkerheds tjek om initialer passer med dem der har lavet SNYT'en
        if(res.locals.me.initials == doc.user) {
            //fix dato
            let yyyy = doc.created.getFullYear();
            let mm = doc.created.getMonth() + 1;
            let dd = doc.created.getDate();

            // console.log("DAAAY" + dd);

            if(dd < 10) {
                dd = '0' + dd;
            }
            if(mm < 10) {
                mm = '0' + mm;
            }
            doc.createdDate = yyyy + '-' + mm + '-' + dd;
            returnJson.data.snyt = doc;
            res.render('editSnyt', returnJson);
        }
        else {
            res.redirect('/');
        }
    }).catch(function(err) {
        returnJson.errors.push(err);
        res.render('index', returnJson);
    });
});

app.post('/deletePictures', function(req, res) {
    //$pop
    Snyt.findOneAndUpdate({_id: req.body.snytid}, {$pop: {pictures: req.body.pics }})
        .catch(function (err) {
            returnJson.errors.push(err);
            res.render('index', returnJson);
        });

    // Snyt.find({"_id" : mongoose.Types.ObjectId(req.body.id)})
    // console.log(req.body);
});

//----------------------------------------------
// Search routes

/*
 * Alle snyt
 */
app.get('/search', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: {
            snyt: null
        }
    };

    Snyt.find({}).sort({'created': -1}).exec(function(err, doc) {
        if(err) {
            returnJson.errors.push('Der skete en under søgningen');
        }
        if(!doc) {
            returnJson.errors.push('Jeg fandt desværre ingen SNYT. Prøv en anden søgning.');
            returnJson.message = 'Der gik noget galt';
        } else {
            returnJson.data.snyt = doc;
        }
        res.render('index', returnJson);
    });
});

/*
 * Almindelig søgning
 */
app.get('/search/:text', function(req, res) {
    var returnJson = {
        errors : [],
        message : null,
        data : {
            snyt: null
        }
    };
    var words = req.params.text.split(" ");
    var regexs = [];
    words.forEach(function(word) {
        regexs.push(new RegExp("\\b(" + word + ")" + "\\b", "i"));
    });
    var subjectRegs = [];
    regexs.forEach(function(i) {
        subjectRegs.push({"subject" : i});
    });
    var textRegs = [];
    regexs.forEach(function(i) {
        textRegs.push({"text" : i});
    });
    var searchObject = {
        "$or" : [
            {
                "$or" : subjectRegs
            },
            {
                "$and" : textRegs
            }
        ]
    };
    Snyt.find(searchObject).sort({"created" : -1}).exec(function(err, doc) {
        if(err) {
            returnJson.errors.push("Der skete en under søgningen");
        }
        if(!doc) {
            returnJson.errors.push("Jeg fandt desværre ingen SNYT. Prøv en anden søgning.");
            returnJson.message = "Der gik noget galt";
        } else {
            returnJson.data.snyt = doc;
        }
        res.render('index', returnJson);
    });
});

/*
 * Avanceret søgning
 */
app.post('/search', function(req, res) {
    var returnJson = {
        errors : [],
        message : null,
        data : {
            snyt: null
        }
    };
    var text = req.body.text;
    var dateFrom = new Date(req.body.dateFrom);
    var dateTo = new Date(req.body.dateTo);
    dateTo.setHours(24);
    dateTo.setMinutes(59);
    dateTo.setSeconds(59);
    dateFrom = dateFrom.toISOString();
    dateTo = dateTo.toISOString();
    var read = req.body.advRadioButtons;
    var category = req.body.category;
    var readOption = {};
    var categoryOption = {};
    var textOption = {};
    if(read == "true") {
        readOption = {"readBy" : {"$in" : [res.locals.me._id.toString()]}};
    } else if(read == "false") {
        readOption = {"readBy" : {"$nin" : [res.locals.me._id.toString()]}};
    }
    if(category.length > 0) {
        categoryOption = {"category" : category};
    }
    if(text.length > 0) {
        var words = req.body.text.split(" ");
        var regexs = [];
        words.forEach(function(word) {
            regexs.push(new RegExp("\\b(" + word + ")" + "\\b", "i"));
        });
        var subjectRegs = [];
        regexs.forEach(function(i) {
            subjectRegs.push({"subject" : i});
        });
        var textRegs = [];
        regexs.forEach(function(i) {
            textRegs.push({"text" : i});
        });
        textOption = {
            "$or" : [
                {
                    "$or" : subjectRegs
                },
                {
                    "$and" : textRegs
                }
            ]
        };
    }

    var searchObject = {
        "$and" :
            [
                categoryOption,
                textOption,
                {"created" : {
                    "$gte" : dateFrom,
                    "$lte" : dateTo
                }},
                readOption
            ]
    };
    Snyt.find(searchObject).sort({"created" : -1}).exec(function(err, doc) {
        if(err) {
            returnJson.errors.push("Der skete en fejl under søgningen");
            returnJson.message = "Der gik noget galt";
        }
        if(!doc) {
            returnJson.errors.push("Jeg fandt desværre ingen SNYT. Prøv en anden søgning.");
            returnJson.message = "Der gik noget galt";
        } else {
            returnJson.data.snyt = doc;
        }
        res.render('index', returnJson);
    });
});

//----------------------------------------------
// Admin routes

/*
 * Login som admin
 */
app.post('/admin/login', function(req, res) {
    var adminUsername = 'administrator';
    var adminPassword = 'pokemon';

    if(req.body.adminUsername == adminUsername && req.body.adminPassword == adminPassword) {
        req.session.adminLoggedIn = 'thisIsAdmin';
    }
    res.redirect('/admin');
});

/*
 * Get admin side (login side hvis man ikke er authenticated)
 */
app.get('/admin', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: {
            users: null
        }
    };
    User.find({}).exec(function(err, doc) {
        if(doc) {
            returnJson.data.users = doc;
        } else {
            returnJson.errors.push('Der skete en fejl, prøv at genindlæse siden');
            returnJson.message = 'Der gik noget galt';
        }
        if(err) {
            returnJson.errors.push('Der skete en fejl, prøv at genindlæse siden');
        }
        console.log(returnJson.errors);
        res.render('admin', returnJson);
    });
});

/*
 * Opret ny bruger i systemet
 */
app.post('/admin', function(req, res) {
    var returnJson = {
        errors: [],
        message: 'Brugeren blev gemt',
        data: null
    };
    User.find({'email': req.body.user.email}).exec(function(err, doc) {
        if(err) {
            returnJson.errors.push('Der skete en fejl på databasen');
        }
        if(doc.length > 0) {
            returnJson.errors.push('Bruger med denne email eksisterer allerede');
        } else {
            returnJson.message = 'Brugeren blev gemt';
        }
        User.find({'initials': req.body.user.initials}).exec(function(err, doc) {
            if(err) {
                returnJson.errors.push('Der skete en fejl på databasen');
            }
            if(doc.length > 0) {
                returnJson.errors.push('Bruger med disse initialer eksisterer allerede');
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
            if(returnJson.errors.length > 0) {
                returnJson.message = "Der gik noget galt";
                res.render("admin", returnJson);
            } else {
                newUser.save(function(err, user) {
                    if(err) {
                        returnJson.errors.push('Kunne ikke gemme');
                        returnJson.message = "Der gik noget galt";
                        res.render("admin", returnJson);
                    } else {
                        res.redirect('/admin');
                    }
                });
            }
        });
    });
});

/*
 * Hjælpefunktion til at få ID på en bruger med email og password i POST
 */
app.post('/admin/user', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({'email': email, 'password': password}).exec(function(err, doc) {
        if(doc.length == 0) {
            res.json({errors: ['Ingen bruger']});
        }
        if(err) {
            res.json({errors: ['Fejl på databasen']});
        }
        res.json(doc._id);
    });
});

/*
 * Rediger en bruger
 */
app.post('/admin/:userid', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: null
    };
    User.findById(mongoose.Types.ObjectId(req.params.userid), function(err, u) {
        if(err) {
            returnJson.errors.push('Der skete en fejl på databasen');
        }
        if(!u) {
            returnJson.errors.push('Ingen bruger');
        }
        if(returnJson.errors.length == 0) {
            u.first = req.body.first;
            u.last = req.body.last;
            u.password = req.body.password;
            u.email = req.body.email;
            u.initials = req.body.initials;
            u.save(function(err) {
                if(err) {
                    returnJson.errors.push('Der skete en fejl da vi forsøgte at gemme');
                    returnJson.message = 'Der gik noget galt';
                    res.render('/admin', returnJson);
                } else {
                    returnJson.message = 'Bruger gemt';
                    res.redirect('/admin');
                }
            });
        } else {
            res.render('admin', returnJson);
        }
    });
});

/*
 * Slet en bruger
 */
app.delete('/admin', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: null
    };
    User.find({'_id': mongoose.Types.ObjectId(req.body.id)}).remove(function(err, doc) {
        if(err || doc.result.n == 0) {
            returnJson.errors.push("Kunne ikke slette");
            console.log(doc);
            res.render("admin", returnJson);
        } else {
            res.redirect("/admin");
        }
    });
});

/*
 * Log out as admin
 */
app.get('/admin/logout', function(req, res) {
    req.session.adminLoggedIn = null;
    res.redirect('/admin');
});

/*
* Helper method to get all users
*/
app.get('/admin/users', function(req, res) {
    User.find().exec(function(err, doc) {
        if(err) {
            res.json({errors: ['Fejl på databasen']});
        }
        if(!doc) {
            res.json({errors: ['Ingen brugere fundet']});
        }
        if(doc) {
            res.json(doc);
        }
    });
});

app.get('/kvitoversigt', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: {
            userCount: null,
            snyt: null
        }
    };
    User.find().exec(function(err, doc) {
        if(err) {
            returnJson.errors.push('Der skete en fejl da vi forsøgte en lave oversigten');
        }
        if(!doc) {
            returnJson.errors.push('Kunne ikke finde nogle brugere');
            returnJson.message = 'Der gik noget galt';
        }
        if(doc) {
            returnJson.data.userCount = doc.length;
            Snyt.find({}).sort({'created': -1}).exec(function(err, docs) {
                if(err) {
                    returnJson.errors.push('Der skete en fejl da vi forsøgte en lave oversigten');
                }
                if(!doc) {
                    returnJson.errors.push('Kunne ikke finde nogle SNYT');
                    returnJson.message = 'Der gik noget galt';
                }
                if(doc) {
                    returnJson.data.snyt = docs;
                    res.render('kvitoversigt', returnJson);
                }
            });
        }
    });
});

app.get('/kvit/:id', function(req, res) {
    var returnJson = {
        errors: [],
        message: null,
        data: {
            allUsersExcept: null,
            snyt: null
        }
    };
    Snyt.findById(req.params.id).exec(function(err, doc) {
        if(err) {
            returnJson.errors.push('Der skete en fejl da vi forsøgte at lave siden');
        }
        if(!doc) {
            returnJson.errors.push('Kunne ikke finde en SNYT her');
            returnJson.message = 'Der gik noget galt';
            res.render('showKvit', returnJson);
        }
        if(doc) {
            returnJson.data.snyt = doc;
            rp.get('http://localhost:1337/admin/users')
                .then(function(json) {
                    returnJson.data.allUsersExcept = JSON.parse(json).filter(function(elem) {
                        return returnJson.data.snyt.readBy.indexOf(elem._id) == -1;
                    });
                    res.render('showKvit', returnJson);
                });
        }
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
    console.log('Server shutting down...');
    mongoose.connection.close();
    server.close();
};

module.exports = {
    app: app,
    shutdown: shutdown
};
