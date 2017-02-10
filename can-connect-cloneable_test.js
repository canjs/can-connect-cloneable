var QUnit = require('steal-qunit');
var makeCloneable = require('./can-connect-cloneable');
var CanMap = require('can-map');
var CanList = require('can-list');
require('can-map-define');
var Fixture = require('can-fixture');
var Connect = require('can-connect');
var ConnectDataUrl = require('can-connect/data/url/url');
var ConnectConstructor = require('can-connect/constructor/constructor');
var ConnectConstructorCallbacksOnce = require('can-connect/constructor/callbacks-once/callbacks-once');
var ConnectRealTime = require('can-connect/real-time/real-time');
var ConnectCanMap = require('can-connect/can/map/map');

Fixture("PUT /test/1", {});

QUnit.module('can-connect-cloneable');

	QUnit.test('Initialized the plugin', function() {
	  	QUnit.equal(typeof makeCloneable, 'function');
	});

// implementations:
// - DefineMap implementation
// X without realtime
// - with realtime + callbacks-once

	QUnit.module('DefineMap');

	QUnit.module('Cloning CanMap', {
		beforeEach: function() {
			this.CloneableMap = CanMap.extend({});

			// create the connection
			var connection = Connect([
				ConnectDataUrl,
				ConnectConstructor,
				ConnectCanMap,
			],{
				idProp: 'id',
				Map: this.CloneableMap,
				url: '/test',
			});

			// manual wire up the canMap to the connection
			this.CloneableMap.connection = connection;

			// QUnit.ok(!CloneableMap.hasOwnProperty("clone"), "cloneableMap does not have a clone property before applying the mixin")

			// apply the mixin
			makeCloneable(this.CloneableMap);
		}
	});

		QUnit.test('Cloning an original without an ID does ??', 0, function() {

		});

		QUnit.test('Saving updates the original', function(assert) {
			var done = assert.async();
			var map = new (this.CloneableMap)({
				name: 'Kyle',
				id: 1
			});
			var clone = map.clone();

			QUnit.notEqual(map, clone, "Clone is not the same instance");

			clone.attr('name', "Justin");

			QUnit.equal(map.attr("name"), "Kyle", "original's name is still Kyle");
			QUnit.equal(clone.attr("name"), "Justin", "clone's name is now Justin");

			clone.save().then(function() {
				QUnit.equal(map.attr("name"), "Justin", "original's name changed to Justin");
				QUnit.equal(clone.attr("name"), "Justin", "clone's name is still Justin");
				QUnit.ok(!map.hasOwnProperty("_original"), "original does not have the _original attribute");
				done();
			});
		});

		QUnit.test('Property changes from the original push to the clone', 0, function() {

		});

		QUnit.test('Define plugin configuration transfers to the clone', 0, function() {

		});
