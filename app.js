var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongoskin');

// Setup different environments: development, test, production
var env = process.env.NODE_ENV || 'development';

//var config = require('./config/config')[env];
var config = require('konfig')({ path: './tools' });

// Setup handlers and components 
//var models = require('./app/models');
//var middleware = require('./app/middleware');
var routes = require('./src/routes/index');

// Setup APIs endpoints
//var users = require('./routes/users');
var apiCollections = require('./src/routes/api-collections');

// Initialize the Express app
var app = express();

// Tell it what port to listen on
app.set('port', process.env.PORT || config.app.port || 3000);

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
// database
//mongoose.connect(config.app.db);
// For remote URIs:   mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
var db = mongo.db('mongodb://@localhost:27017/test', {safe:true});
// var server = mongo.Server;
// var mongoClient = mongo.MongoClient;
// var replSetServers = mongo.ReplSetServers;

// Middleware
//middleware(app);

// Application routes
//routes(app);


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

console.log('About to listen on port for ' + env);
// Startup the server
//if (env == 'test' || process.env.NODE_ENV == 'test'){
app.listen(app.get('port'));
//}
console.log('Express server listening on port ' + app.get('port'));

// export app so we can test it
exports = module.exports = app;