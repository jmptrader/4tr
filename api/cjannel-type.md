#Index

**Classes**

* [class: ChannelType](#ChannelType)
  * [new ChannelType(type, name, units)](#new_ChannelType)

**Functions**

* [identity()](#identity)
* [notCovered()](#notCovered)
 
<a name="ChannelType"></a>
#class: ChannelType
ChannelType

**Members**

* [class: ChannelType](#ChannelType)
  * [new ChannelType(type, name, units)](#new_ChannelType)

<a name="new_ChannelType"></a>
##new ChannelType(type, name, units)
The ChannelType Represents a particular kind of input or output on a DeviceType.
(i.e. temperature, humidity, distance, etc)

**Params**

- type `string` - Whether the channel is an input, output, or both  
- name `string` - Name of the channel type  
- units `string` - The units that the channel outputs data as  

**Example**  
```Javascript
new ChannelType('input', 'temperature', 'F');
```

<a name="identity"></a>
#identity()
**Returns**: `string` - A human readable descriptor in the format "<type>: <name> in <units>"  
<a name="notCovered"></a>
#notCovered()
