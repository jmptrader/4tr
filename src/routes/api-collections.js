/*jslint node: true */
/*jshint strict:false */
'use strict';

var express = require('express');
var router = express.Router();
var app = express();

// Get details from package.json for the healthcheck response
var pkginfo = require('pkginfo')(module, 'name', 'version', 'build');
//console.dir(module.exports);

// Middleware to use for all requests
router.use(function(req, res, next) {
    // Authentication & logging
    console.log('API request start');
    // Always or middleware becomes endware :D
    next();
});

// Health status endpoint at base of API and at /api/status
var healthStatus = {
  message: 'ok',
  name: module.exports.name,
  mode: app.settings.env,
  version: module.exports.version,
  build: module.exports.build
};
router.get('/status', function(req, res, next) {
  res.json(healthStatus);
});



// Look for and extract the collectionName parameter
router.param('collectionName', function(req, res, next, collectionName){
  // Retrieve the collection, save it on the request, then next
  console.log('collectionName: ' + collectionName);
  req.collection = req.db.collection(collectionName);
  return next();
});


// Create an object
router.post('/collections/:collectionName', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e);
    res.send(results);
  });
});


// Find a single object
router.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e);
    res.send(result);
  });
});

// Retrieve a list of items sorted by _id and which has a limit of 10
router.get('/collections/:collectionName', function(req, res, next) {
  req.collection
    .find({},{limit:10, sort: [['_id',-1]]})
    .toArray(function(e, results){
      if (e) return next(e);
      res.send(results);
    });
});

// Update an object
router.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
  });
});

// Delete an object
router.delete('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
  });
});


module.exports = router;
