/*can-connect-cloneable@0.1.2#can-connect-cloneable*/
define(function (require, exports, module) {
    var each = require('can-util/js/each');
    var deepAssign = require('can-util/js/deep-assign');
    var assign = require('can-util/js/assign');
    var getIdProps = require('can-connect/helpers/get-id-props');
    module.exports = function makeClone(Type) {
        var idProp = getIdProps(Type.connection)[0];
        var definition = {
            save: function () {
                var data = this.serialize();
                delete data._original;
                if (this._original[idProp]) {
                    data[idProp] = this._original[idProp];
                    return this._original.constructor.connection.updateData(data).then(function () {
                        Type.connection.updatedInstance(this._original, data);
                    }.bind(this));
                } else {
                    return this._original.constructor.connection.createData(data).then(function (res) {
                        Type.connection.createdInstance(this._original, deepAssign({}, data, res));
                    }.bind(this));
                }
            }
        };
        if (Type.prototype.hasOwnProperty('_define')) {
            each(Type.prototype._define.definitions, function (def, prop) {
                definition[prop] = assign(assign({}, def), {
                    get: def.get || function (lastSet) {
                        return lastSet !== undefined ? lastSet : this._original[prop];
                    },
                    serialize: def.serialize === undefined ? def.get ? false : true : def.serialize
                });
            });
            deepAssign(definition, { _original: { Type: Type } });
        } else {
            definition.define = {};
            each(Type.prototype.define, function (def, prop) {
                definition.define[prop] = assign(assign({}, def), {
                    get: def.get || function (lastSet) {
                        return lastSet !== undefined ? lastSet : this._original[prop];
                    },
                    serialize: def.serialize === undefined ? def.get ? false : true : def.serialize
                });
            });
            deepAssign(definition, { define: { _original: { Type: Type } } });
        }
        delete definition[idProp];
        var Clone = Type.extend(definition);
        Type.prototype.clone = function clone() {
            var props = {};
            props._original = this;
            return new Clone(props);
        };
    };
});