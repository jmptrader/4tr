/**
 * Updates require path so that instrumented code can be loaded during test coverage analysis
 *
 * @param String path
 *    Any valid require path
 *
 * @return String path
 *    The path to the correct environment
 *
 * Using requireHelper in a test
 *    var requireHelper = require('../require-helper');
 *    var formValidator = requireHelper('form-validator');
 *
 */
module.exports = function (path) {
  return require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + path);
};