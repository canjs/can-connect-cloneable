var canMap = require('can-map');
var each = require('can-util/js/each/each');
var getIdProps = require('can-connect/helpers/get-id-props');

// makes a clone by wiring all of it's properties to read from ._original[prop]
module.exports = function makeClone(Type) {
	if (Type.prototype instanceof canMap) {
		var idProp = getIdProps(Type.connection)[0];
		var definition = {
			define: {
				_original: {
					Type: Type,
				},
			},
			save() {
				var data = this.serialize();
				delete data._original;
				data[idProp] = this._original[idProp];
				this._original.serialize();
				return this._original.constructor.connection.updateData(data).then(function() {
					Type.connection.updatedInstance(this._original, data);
				}.bind(this));
			},
		};

		if (Type.prototype.hasOwnProperty('define')) {
			each(Type.prototype.define, function(def, prop) {
				definition.define[prop] = def;
			});	
		}
		var Clone = Type.extend(definition);

		Type.prototype.clone = function clone() {
			var props = this.serialize();
			delete props[idProp];
			props._original = this;
			return new Clone(props);
		};
	}
}
