/*jslint node: true */
/*jshint strict:false */
/*eslint-disable */
'use strict';

var express = require('express');
var router = express.Router();
/*eslint-enable */

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
