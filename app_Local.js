'use strict'

var express = require("express"),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    mongoose = require('mongoose'),
    config = require('./config/database_Local.js'),
    passport = require('passport'),
    http = require("http"),
    app = express();

// connect to Mongo when the app initializes
mongoose.connect(config.db); // connect to mongo database

// =========== middleware ======================Questionnaire
// Initial the the passport 
app.use(bodyParser.json());
// get information from html forms
app.use(passport.initialize());


// validate the corresponding request object 
app.use(expressValidator({
    customValidators: {
        isArray: function (value) {
            return Array.isArray(value);
        },
        isString: function (value) {
            return typeof value === 'string'
        }
    }
}));


// routes =========================================================
var routes = require("./routes.js")(app, passport);

// Bring in defined Passport Strategy
require('./config/passport.js')(passport);

// load the files which are in the controllers and models directory
app.use('/controllers', express.static(__dirname + '/controllers'));
app.use('/models', express.static(__dirname + '/models'));
app.use('/', express.static(__dirname + '/UI'));

var server = app.listen(1080, function () {
    console.log('Server listening at port : %s', server.address().port);
});
