// channel-type.js

/**
 * Represents a particular kind of input or output on a DeviceType (i.e. temperature, 
 * humidity, distance, etc)
 *
 * @param name Name of the channel type
 * @param units The units that the channel outputs data as
 * @param type Whether the channel is an input, output, or both
 *
 * Example: new ChannelType('temperature');
 * 
 * @constructor
 */
function ChannelType(name, units, type) {
  this.name   = name  || "New channel";
  this.units  = units || null;
  this.type   = type  || null;   // TODO: Convert input and output to constants
  this.stream = null;
}

ChannelType.prototype = {
  constructor: ChannelType,

  identity: function() {
    return this.type + ": " + this.name + " in " + this.units ;
  }

};

module.exports = ChannelType;