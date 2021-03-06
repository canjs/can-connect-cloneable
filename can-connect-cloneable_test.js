var QUnit = require("steal-qunit");
var makeCloneable = require("can-connect-cloneable");
var DefineMap = require("can-define/map/map");
require("can-define/list/list");
var CanMap = require("can-map");
require("can-map-define");
require("can-list");
var fixture = require("can-fixture");
var connect = require("can-connect");
var ConnectDataUrl = require("can-connect/data/url/url");
var ConnectConstructor = require("can-connect/constructor/constructor");
var ConnectCanMap = require("can-connect/can/map/map");

QUnit.module("can-connect-cloneable");

	QUnit.test("Initialized the plugin", function(assert) {
	  	assert.equal(typeof makeCloneable, "function");
	});

	QUnit.module("can-connect-cloneable with DefineMap", {
		beforeEach: function(assert) {
			fixture("POST /test", { id: 1 });
			fixture("PUT /test/1", {});

			this.runSetterAssertions = false;
			var self = this;
			this.CloneableDefineMap = DefineMap.extend({
				info: {
					get: function() {
						return this.name + " is " + this.age;
					}
				},
				age: {
					value: 30,
					type: "number",
					set: function(age) {
						if (self.runSetterAssertions) {
							assert.ok(true, "setter ran");	
						}
						return age; 
					}
				},
				name: {},
				id: {}
			});

			// create the connection
			var connection = connect([
				ConnectDataUrl,
				ConnectConstructor,
				ConnectCanMap
			],{
				idProp: "id",
				Map: this.CloneableDefineMap,
				url: "/test",
			});

			// manual wire up the canMap to the connection
			this.CloneableDefineMap.connection = connection;

			// apply the mixin
			makeCloneable(this.CloneableDefineMap);
		}
	});

		QUnit.test("Initialization", function(assert) {
			var noncloneableMap = new DefineMap({});
			var cloneableMap = new (this.CloneableDefineMap)({});
			var clone = cloneableMap.clone();

			assert.ok(!noncloneableMap.constructor.prototype.hasOwnProperty("clone"), "base Map does not have a clone method");
			assert.ok(cloneableMap.constructor.prototype.hasOwnProperty("clone"), "cloneableMap has a clone method");
			assert.notEqual(cloneableMap, clone, "Clone is not the same instance");
		});

		QUnit.test("Saving an original without an ID does a create", function(assert) {
			var done = assert.async();
			var map = new (this.CloneableDefineMap)({
				name: "Kyle"
			});
			var clone = map.clone();
			clone.name = "Justin";

			assert.equal(map.name, "Kyle", "original's name is still Kyle");
			assert.equal(clone.name, "Justin", "clone's name is now Justin");

			clone.save().then(function() {
				assert.equal(map.name, "Justin", "original's name changed to Justin");
				assert.equal(clone.name, "Justin", "clone's name is still Justin");
				assert.ok(!map.hasOwnProperty("_original"), "original does not have the _original attribute");
				assert.equal(map.id, 1, "original receives an ID");
				assert.equal(clone.id, undefined, "clone still does not have an ID until saving");
				done();
			});
		});

		QUnit.test("Saving updates the original", function(assert) {
			var done = assert.async();
			var map = new (this.CloneableDefineMap)({
				name: "Kyle",
				id: 1
			});
			var clone = map.clone();
			clone.name = "Justin";

			assert.equal(map.name, "Kyle", "original's name is still Kyle");
			assert.equal(clone.name, "Justin", "clone's name is now Justin");

			clone.save().then(function() {
				assert.equal(map.name, "Justin", "original's name changed to Justin");
				assert.equal(clone.name, "Justin", "clone's name is still Justin");
				assert.ok(!map.hasOwnProperty("_original"), "original does not have the _original attribute");
				done();
			});
		});

		QUnit.test("Property changes from the original push to the clone", function(assert) {
			var map = new (this.CloneableDefineMap)({
				name: "Kyle",
				id: 1
			});
			var clone = map.clone();
			assert.equal(clone.name, "Kyle", "clone's name has the value of original");
			map.name = "Justin";
			assert.equal(clone.name, "Justin", "clone's name changes when original's name changes");
		});

		QUnit.test("Getters/Setters/type transfers to the clone", function(assert) {
			assert.expect(5);
			this.runSetterAssertions = true;
			var map = new (this.CloneableDefineMap)({
				name: "Kyle",
				id: 1
			});
			var clone = map.clone();

			// setter runs once for map, once for clone, and once here = 5x
			assert.equal(clone.info, "Kyle is 30");
			clone.age = "32";
			assert.ok(clone.age === 32, "type applied");
			assert.equal(clone.info, "Kyle is 32", "getter applied");
		});

	QUnit.module("can-connect-cloneable with CanMap", {
		beforeEach: function(assert) {
			fixture("POST /test", { id: 1 });
			fixture("PUT /test/1", {});

			this.runSetterAssertions = false;
			var self = this;
			this.CloneableCanMap = CanMap.extend({
				define: {
					info: {
						get: function() {
							return this.attr("name") + " is " + this.attr("age");
						}
					},
					age: {
						value: 30,
						type: "number",
						set: function(age) {
							if (self.runSetterAssertions) {
								assert.ok(true, "setter ran");	
							}
							return age; 
						}
					},
					name: {}
				},
			});

			// create the connection
			var connection = connect([
				ConnectDataUrl,
				ConnectConstructor,
				ConnectCanMap,
			],{
				idProp: "id",
				Map: this.CloneableCanMap,
				url: "/test",
			});

			// manual wire up the canMap to the connection
			this.CloneableCanMap.connection = connection;

			// apply the mixin
			makeCloneable(this.CloneableCanMap);
		}
	});

		QUnit.test("Initialization", function(assert) {
			var noncloneableMap = new CanMap({});
			var cloneableMap = new (this.CloneableCanMap)({});
			var clone = cloneableMap.clone();

			assert.ok(!noncloneableMap.constructor.prototype.hasOwnProperty("clone"), "base Map does not have a clone method");
			assert.ok(cloneableMap.constructor.prototype.hasOwnProperty("clone"), "cloneableMap has a clone method");
			assert.notEqual(cloneableMap, clone, "Clone is not the same instance");
		});

		QUnit.test("Cloning an original without an ID does a create", function(assert) {
			var done = assert.async();
			var map = new (this.CloneableCanMap)({
				name: "Kyle"
			});
			var clone = map.clone();
			clone.attr("name", "Justin");

			assert.equal(map.attr("name"), "Kyle", "original's name is still Kyle");
			assert.equal(clone.attr("name"), "Justin", "clone's name is now Justin");

			clone.save().then(function() {
				assert.equal(map.attr("name"), "Justin", "original's name changed to Justin");
				assert.equal(clone.attr("name"), "Justin", "clone's name is still Justin");
				assert.ok(!map.hasOwnProperty("_original"), "original does not have the _original attribute");
				assert.equal(map.attr("id"), 1, "original receives an ID");
				assert.equal(clone.attr("id"), undefined, "clone still does not have an ID until saving");
				done();
			});
		});

		QUnit.test("Saving updates the original", function(assert) {
			var done = assert.async();
			var map = new (this.CloneableCanMap)({
				name: "Kyle",
				id: 1
			});
			var clone = map.clone();
			clone.attr("name", "Justin");

			assert.equal(map.attr("name"), "Kyle", "original's name is still Kyle");
			assert.equal(clone.attr("name"), "Justin", "clone's name is now Justin");

			clone.save().then(function() {
				assert.equal(map.attr("name"), "Justin", "original's name changed to Justin");
				assert.equal(clone.attr("name"), "Justin", "clone's name is still Justin");
				assert.ok(!map.hasOwnProperty("_original"), "original does not have the _original attribute");
				done();
			});
		});

		QUnit.test("Property changes from the original push to the clone", function(assert) {
			var map = new (this.CloneableCanMap)({
				name: "Kyle",
				id: 1
			});
			var clone = map.clone();
			assert.equal(clone.attr("name"), "Kyle", "clone's name has the value of original");
			map.attr("name", "Justin");
			assert.equal(clone.attr("name"), "Justin", "clone's name changes when original's name changes");
		});

		QUnit.test("Define plugin configuration transfers to the clone", function(assert) {
			assert.expect(5);
			this.runSetterAssertions = true;
			var map = new (this.CloneableCanMap)({
				name: "Kyle",
				id: 1
			});
			var clone = map.clone();

			// setter runs once for map, once for clone, and once here = 3x
			clone.attr("age", "32");
			assert.ok(clone.attr("age") === 32, "type applied");
			assert.equal(clone.attr("info"), "Kyle is 32", "getter applied");
		});
