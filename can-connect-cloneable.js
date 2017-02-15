// var each = require("can-util/js/each/each");
var deepAssign = require("can-util/js/deep-assign/deep-assign");
var getIdProps = require("can-connect/helpers/get-id-props");

// makes a clone by wiring all of it's properties to read from ._original[prop]
module.exports = function makeClone(Type) {
	var idProp = getIdProps(Type.connection)[0];
	var definition = {
		save() {
			var data = this.serialize();
			delete data._original;

			if (this._original[idProp]) {
				data[idProp] = this._original[idProp];
				return this._original.constructor.connection.updateData(data).then(function() {
					Type.connection.updatedInstance(this._original, data);
				}.bind(this));
			} else {
				return this._original.constructor.connection.createData(data).then(function(res) {
					Type.connection.createdInstance(this._original, deepAssign({}, data, res));
				}.bind(this));
			}
		},
	};

	// Specific functions for DefineMap and CanMap
	if (Type.prototype.hasOwnProperty('_define')) {
		// add a reference to the original
		deepAssign(definition, {
			_original: {
				Type: Type
			}
		});
	} else {
		// add a reference to the original
		deepAssign(definition, {
			define: {
				_original: {
					Type: Type
				}
			}
		});
	}

	var Clone = Type.extend(definition);
	Type.prototype.clone = function clone() {
		var props = this.serialize();
		delete props[idProp];
		props._original = this;
		return new Clone(props);
	};
};
