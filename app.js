var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongoskin');

// Setup www pages
var routes = require('./src/routes/index');

// Setup APIs endpoints
//var users = require('./routes/users');
var apiCollections = require('./src/routes/api-collections');

// Initialize the Express app
var app = express();

// Setup the view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');

// Favicon
app.use(favicon(__dirname + '/src/public/favicon.ico'));

// Logger
app.use(logger('dev'));

// Set the body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure cookies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mongo datastore setup
// For remote URIs:   mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
var db = mongo.db('mongodb://@localhost:27017/test', {safe:true});
// var server = mongo.Server;
// var mongoClient = mongo.MongoClient;
// var replSetServers = mongo.ReplSetServers;

// Make datastore accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Setup routes
app.use('/', routes);
//app.use('/users', users);

// All of the REST API routes will be prefixed by /api
app.use('/api', apiCollections); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers

// Development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler does not leak stacktraces to users
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
