/*jslint node: true */
/*jshint strict:false */
'use strict';
/**
 * Promise aware test method
 */
function itAsync(testLabel, testFunction) {
  it(testLabel, function(done) {
    testFunction()
      .then(
        function () {
          done();
        },
        function (err) {
          done(err);
        }
      )
      .done();
  });
}

/**
 * Clones / deep copies an object.
 *
 * @param Object obj
 *   Any object
 *
 * @return Object
 *   obj--cloned
 *
describe('addOne Exemplary Tests', function() {
  var AddOne;

   // Instead of requiring add-one in each test--making each test async,
   // require it in beforeEach, clone it, and sneak it into a global
   // so that no test can (permanently) mess with / mutate it.

  beforeEach(function(done) {
    require([
      'add-one'
    ], function(_AddOne) {
      AddOne = clone(_AddOne);
      done();
    });
  });

  it('Should be 2.', function() {
    chai.assert.equal(AddOne.addOne(1), 2);
  });

  it('Should be 42; Sinon stub.', function() {
    // Stub addOne to return 42--no matter what.
    sinon.stub(AddOne, "addOne").returns(42);

    chai.assert.equal(AddOne.addOne(1), 42);

    // Don't forget to restore (not necessary with clone, but good practice).
    AddOne.addOne.restore();
  });

  it('Should be 2 (again); unstubbed.', function() {
    chai.assert.equal(AddOne.addOne(1), 2);
  });
});

 */
function clone(obj) {
    if (obj === null || typeof(obj) !== 'object') {
      return obj;
    }

    var temp = {},
        key ;

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        temp[key] = clone(obj[key]);
      }
    }
    return temp;
}
