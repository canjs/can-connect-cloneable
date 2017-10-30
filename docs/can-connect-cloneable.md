@module {function} can-connect-cloneable
@parent can-data-modeling
@collection can-ecosystem
@package ../package.json

@description Makes mutable clones of [can-connect]’d maps. Changes to the clone save back to the original; likewise, changes to the original propagate to the clone.

@signature `makeCloneable(Type)`

Makes `Type` cloneable by giving its instances a `clone` method.

```javascript
var DefineMap = require("can-define/map/map");
var makeCloneable = require("can-connect-cloneable");

var MyDefineMap = DefineMap.extend({ name: "string" });
makeCloneable(MyDefineMap);

var original = new MyDefineMap({ name: "Kyle" });
var clone = original.clone();
clone.name; // -> "Kyle"
```

  @param {can-map|can-define/map/map} Type The DefineMap or CanMap you want to make clonable


@body

## Use

`can-connect-cloneable` can be used with `[can-define/map/map DefineMaps]` or legacy `[can-map CanMaps]`. To make `Map` instances clonable, include `can-connect-cloneable` and call it with the `Map` constructor as the parameter. This adds a `clone` method to future instances of `Map`.

An instance and its clone have a special relationship:

1. Changes to the original instance propogate automatically to the clone.
2. Changes to the cloned instance do *not* propogate to the original until you call the clone’s `save` method.

### Using DefineMap (`[can-define/map/map]`)

Apply the mixin:

```javascript
var makeCloneable = require("can-connect-cloneable");
var DefineMap = require("can-define/map/map");
var connect = require("can-connect");

// Extend DefineMap
var MyDefineMap = DefineMap.extend({ name: "string" });

// create the connection
var connection = connect([
    require("can-connect/data/url/url"),
    require("can-connect/constructor/constructor"),
    require("can-connect/can/map/map")
],{
    Map: MyDefineMap,
    url: "/api/endpoint"
});

// apply the mixin
makeCloneable(MyDefineMap);
```

Use the clone method:

```javascript
var original = new MyDefineMap({ name: "Kyle" });
var clone = original.clone();
```

Make changes to the clone and save, updating the original:

```javascript
// Change name on the clone instance
clone.name = "Justin";

// The value on the clone changes, but not the original value
original.name; // -> "Kyle"
clone.name; // -> "Justin"

// Once the clone is saved, the clone values propogate to the original
clone.save();
original.name; // -> "Justin"
clone.name; // -> "Justin"

```

Make changes to the original, updating the clone:

```javascript
original.name; // -> "Justin"
clone.name; // -> "Justin"

// Change name on the original instance
original.name = "Kyle";

// The value on the clone changes automatically
original.name; // -> "Kyle"
clone.name; // -> "Kyle"

```

### Using CanMap (`[can-map]`)

Apply the mixin:

```javascript
var makeCloneable = require("can-connect-cloneable");
var CanMap = require("can-map");
require("can-map-define");
var connect = require("can-connect");

// Extend CanMap
var MyCanMap = CanMap.extend({
  define: {
    name: {
      type: "string"
    }
  }
});

// create the connection
var connection = connect([
    require("can-connect/data/url/url"),
    require("can-connect/constructor/constructor"),
    require("can-connect/can/map/map")
],{
    Map: MyCanMap,
    url: "/api/endpoint"
});

// apply the mixin
makeCloneable(MyCanMap);
```

Use the clone method:

```javascript
var original = new MyCanMap({ name: "Kyle" });
var clone = original.clone();
```

Make changes to the clone and save, updating the original:

```javascript
// Change name on the clone instance
clone.attr("name", "Justin");

// The value on the clone changes, but not the original value
original.attr("name"); // -> "Kyle"
clone.attr("name"); // -> "Justin"

// Once the clone is saved, the clone values propogate to the original
clone.save();
original.attr("name"); // -> "Justin"
clone.attr("name"); // -> "Justin"

```

Make changes to the original, updating the clone:

```javascript
original.attr("name"); // -> "Justin"
clone.attr("name"); // -> "Justin"

// Change name on the original instance
original.attr("name", "Kyle");

// The value on the clone changes automatically
original.attr("name"); // -> "Kyle"
clone.attr("name"); // -> "Kyle"
```
