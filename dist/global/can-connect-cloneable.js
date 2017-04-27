/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod){
		if(!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, "default": true };
		for(var p in mod) {
			if(!esProps[p]) return false;
		}
		return true;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			if(useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-connect-cloneable@0.1.0#can-connect-cloneable*/
define('can-connect-cloneable', function (require, exports, module) {
    var each = require('can-util/js/each/each');
    var deepAssign = require('can-util/js/deep-assign/deep-assign');
    var assign = require('can-util/js/assign/assign');
    var getIdProps = require('can-connect/helpers/get-id-props');
    module.exports = function makeClone(Type) {
        var idProp = getIdProps(Type.connection)[0];
        var definition = {
            save() {
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
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();