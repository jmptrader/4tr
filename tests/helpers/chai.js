//process.env.NODE_ENV = process.env.NODE_ENV || 'test';
//process.env.TEST_ENV = process.env.TEST_ENV || 'test';

var chai = require('chai');
chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;