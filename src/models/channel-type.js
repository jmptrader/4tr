/*jslint node: true */
/*jshint strict:false */
'use strict';
/**

The ChannelType object represents a particular kind of input or output on a DeviceType.
(i.e. temperature, humidity, distance, etc)

@class ChannelType
@summary Represents and Channel input/output
@desc The ChannelType object represents a particular kind of input or output on a DeviceType. (i.e. temperature, humidity, distance, etc)

@param type {string} Whether the channel is an input, output, or both
@param name {string} Name of the channel type
@param units {string} The units that the channel outputs data as

@example <caption>Usage</caption>
```Javascript
var ct = new ChannelType('input', 'temperature', 'F');
```

@constructor
*/
function ChannelType(type, name, units) {
  // TODO: Convert input and output to constants
  this.type   = type  || null;
  this.name   = name  || 'New channel';
  this.units  = units || null;
  this.stream = null;
}

ChannelType.prototype = {
  constructor: ChannelType,

/**
@method identity
@return {string} A human readable descriptor in the format '[type]: [name] in [units]'
@example <caption>Usage</caption>
```Javascript
var ct = new ChannelType('input', 'temperature', 'F');
ct.identity;
// returns 'input: temperature in F'
```
*/
  identity: function() {
    return this.type + ': ' + this.name + ' in ' + this.units ;
  },

/**
@method notCovered
*/
  notCovered: function() {
    return 'This should trigger a code coverage violation' ;
  }

};

module.exports = ChannelType;
