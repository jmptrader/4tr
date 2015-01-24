/*jslint node: true */
/*jshint strict:false */
/*eslint-disable */
'use strict';

var express = require('express');
var router = express.Router();
/*eslint-enable */

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
