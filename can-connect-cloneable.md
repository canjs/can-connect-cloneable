@page can-connect-cloneable

# can-connect-cloneable

Allows you to make mutable clones of can-connected maps and save changes back to the original.

## Install

```sh
git clone git@github.com:canjs/can-connect-cloneable.git
cd ./can-connect-cloneable
npm install
```

### Build

Run `npm run build`

### Test

Run `npm run test`

This will run the jshint script before actually running tests.

To run just the tests, run `npm run testee`.

To run tests in the browser, run `npm run develop` and browse to `http://127.0.0.1:8080/test.html`


## Usage

`npm install can-connect-cloneable --save`

Note: `can-connect-cloneable` requires (can-connect)[https://canjs.com/doc/can-connect.html], and requires the [RealTime](http://canjs.com/doc/can-connect/real-time/real-time.html) connection be enabled.

### With DefineMap (`can-define/map/map`)
```javascript
var makeCloneable = require('can-connect-cloneable');
var DefineMap = require('can-define/map/map');
var connect = require("can-connect");

// create the DefineMap
var map = new DefineMap({name: 'Kyle'});

// create the connection
var connection = connect.superMap([
    require("can-connect/data/url/url"),
    require("can-connect/constructor/constructor"),
    require("can-connect/real-time/real-time")
],{
	Map: map,
    url: "/api/todos"
});

// apply the mixin
makeCloneable(DefineMap);```

```javascript
var clone = map.clone();
clone.name = "Justin";

map.name; // -> "Kyle"
clone.name; // -> "Justin"

clone.save();

map.name; // -> "Justin"
clone.name; // -> "Justin"

```

### With Legacy CanMap (`can-map`)

```javascript
var makeCloneable = require('can-connect-cloneable');
var canMap = require('can-map');
var connect = require("can-connect");

var map = new canMap({name: 'Kyle'});

// create the connection
var connection = connect.superMap([
    require("can-connect/data/url/url"),
    require("can-connect/constructor/constructor"),
    require("can-connect/real-time/real-time")
],{
	Map: map,
    url: "/api/todos"
});

// manual wire up the canMap to the connection
canMap.connection = connection;

// apply the mixin
makeCloneable(canMap);```

```javascript
var clone = map.clone();
clone.attr('name', "Justin");

map.attr("name"); // -> "Kyle"
clone.attr("name"); // -> "Justin"

clone.save();

map.attr("name"); // -> "Justin"
clone.attr("name"); // -> "Justin"

```
