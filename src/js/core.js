var CORE = (function () {
	'use strict';
	
	var moduleData = {}, // all the modules are stored here
	to_s = function (anything) {
		return Object.prototype.toString.call(anything);
	},
	debug = true,

	debug = function (on) { // to decide whether log errors in console or send them to server
		debug = on ? true : false;
	},
	register = function (moduleName, fn) {
		var temp;
		if (typeof moduleName !== 'string' && typeof fn !== 'function') {
			log(1, 'Module ' + moduleName + ' registration failed : 1 or more args are of incorrect type.');
			return;
		}
		//console.log(fn(Sandbox.create(CORE, moduleName)));
		temp = fn(Sandbox.create(CORE, moduleName));
		if (!temp.init && typeof temp.init !== 'function' && !temp.destroy && typeof temp.destroy !== 'function') {
			log(1, 'Module ' + moduleName + ' registration failed: instance has not init or destroy functions');
			return;
		}
		temp = null;
		moduleData[moduleName] = {
			create: fn,
			instance: null
		};
	},
	start = function (moduleName) {
		var mod = moduleData[moduleName];
		if (mod) {
			mod.instance = mod.create(Sandbox.create(CORE, moduleName));
			mod.instance.init();
		}
	},
	startAll = function () {
		var moduleName;
		for (moduleName in moduleData) {
			if (!moduleData.hasOwnProperty(moduleName)) return;
			start(moduleName);
		}
	},
	stop = function (moduleName) {
		var data;
		if (data == moduleData[moduleName] && data.instance) {
			log(1, 'Stop module ' + moduleName + ' Falied: module does not exist or has not been started.');
			return;
		}
		data.instance.destroy();
		data.instance = null;
	},
	stopAll = function () {
		var moduleName;
		for (moduleName in moduleData) {
			if (!moduleData.hasOwnProperty(moduleName)) return;
			stop(moduleName);
		}
	},
	registerEvents = function (evts, mod) {
		if (is_obj(evts) && mod) {
			if (!moduleData[mod]) {
				log(1, '');
				return;
			}
			moduleData[mod].events = evts;
		}
	},
	triggerEvent = function (evt) {
		var mod;
		for (mod in moduleData) {
			if (!moduleData.hasOwnProperty(mod)) return;
			mod = moduleData[mod];
			if (mod.events && mod.events[evt.type]) {
				mod.events[evt.type](evt.data);
			}
		}
	},
	removeEvents = function (evts, mod) {
		if (is_obj(evts) && mod && (mod = moduleData[mod]) && mod.events) {
			delete mod.events;
		}
	},
	log = function (severity, message) {
		if (debug) {
			console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
		} else {
			// send error to server
		}
	},
	dom = {
		query: function (selector, context) {
			var ret = {}, self = this, jqEls, i = 0;
			if (context && context.find) { // context is jquery object which has children of this object
				jqEls = context.find(selector);
			} else {
				jqEls = jQuery(selector);
			}

			ret = jqEls.get(); // here is the problem
			ret.length = jqEls.length;
			ret.query = function (sel) {
				return self.query(sel, jqEls);
			}
			return ret;
		},
		bind: function (element, evt, fn) {
			if (element && evt) {
				if (typeof evt === 'function') {
					fn = evt;
					evt = 'click';
				}
				// $(document).on(evt, element, fn);
				$(element).bind(evt, fn);
			} else {
				// log wrong arguments
			}
		},
		unbind: function (element, evt, fn) {
			if (element && evt) {
				if (typeof evt === 'function') {
					fn = evt;
					evt = 'click';
				}
				jQuery(element).unbind(evt, fn);
			} else {
				// log wrong arguments
			}
		},
		create: function (el) {
			return document.createElement(el);
		},
		apply_attrs: function (el, attrs) {
			$(el).attr(attrs);
		}
	},

	is_arr = function (arr) {
		return jQuery.isArray(arr);
	},
	is_obj = function (obj) {
		return jQuery.isPlainObject(obj);
	};

	return {
		register: register,
		start: start,
		startAll: startAll,
		stop: stop,
		stopAll: stopAll,
		registerEvents: registerEvents,
		triggerEvent: triggerEvent,
		removeEvents: removeEvents,
		is_obj: is_obj,
		is_arr: is_arr,
		dom: dom
	};
}());
