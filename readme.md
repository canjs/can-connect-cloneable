# can-connect-cloneable

[![Build Status](https://travis-ci.org/canjs/can-connect-cloneable.png?branch=master)](https://travis-ci.org/canjs/can-connect-cloneable)

Allows you to make mutable clones of can-connected maps and save changes back to the original

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-connect-cloneable';
```

### CommonJS use

Use `require` to load `can-connect-cloneable` and everything else
needed to create a template that uses `can-connect-cloneable`:

```js
var plugin = require("can-connect-cloneable");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-connect-cloneable` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-connect-cloneable',
		    	location: 'node_modules/can-connect-cloneable/dist/amd',
		    	main: 'lib/can-connect-cloneable'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-connect-cloneable/dist/global/can-connect-cloneable.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
