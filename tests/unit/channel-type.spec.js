
// Without test coverage requireHelper
//var ChannelType = require('../../models/channel-type');

// Get the require helper that allows test coverage analysis
var requireHelper = require('../helpers/require-helper');

// Bring in the object we're going to test
var ChannelType = requireHelper('channel-type');


describe("ChannelType", function() {


  describe("constructor", function() {

    it("should have a default name but not units, type, or stream", function() {
      var ct = new ChannelType();
      expect(ct.name).to.equal("New channel");
      expect(ct.units).to.equal(null);
      expect(ct.type).to.equal(null);
      expect(ct.stream).to.equal(null);
    });
 
    it("should set ChannelType's name, units, and type if provided", function() {
      var ct = new ChannelType('Temperature', 'F', 'I');
      expect(ct.name).to.equal('Temperature');
      expect(ct.units).to.equal('F');
      expect(ct.type).to.equal('I');
      expect(ct.stream).to.equal(null);
    });

  });
 

  describe("#identity", function() {

    it("should return a human readable string that conveys its identity", function() {
      var ct = new ChannelType('Temperature', 'F', 'I');
      expect(ct.identity()).to.equal('I: Temperature in F');
    });
    
  });


});