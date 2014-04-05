var CORE = (function () {
	var moduleData = {}, // all the modules are stored here
	to_s = function (anything) {
		return Object.prototype.toString.call(anything);
	},
	debug = true;

	return {
		debug: function (on) { // to decide whether log errors in console or send them to server
			debug = on ? true : false;
		},
		register: function (moduleID, creator) {
			var temp;
			if (typeof moduleID !== 'string' && typeof creator !== 'function') {
				this.log(1, 'Module ' + moduleID + ' registration failed : 1 or more args are of incorrect type.');
				return;
			}
			temp = creator(Sandbox.create(this, moduleID));
			if (!temp.init && typeof temp.init !== 'function' && !temp.destroy && typeof temp.destroy !== 'function') {
				this.log(1, 'Module ' + moduleID + ' registration failed: instance has not init or destroy functions');
				return;
			}
			temp = null;
			moduleData[moduleID] = {
				create: creator,
				instance: null
			};
		},
		start: function (moduleID) {
			var mod = moduleData[moduleID];
			if (mod) {
				mod.instance = mod.create(Sandbox.create(this, moduleID));
				mod.instance.init();
			}
		},
		startAll: function () {
			var moduleID;
			for (moduleID in moduleData) {
				if (!moduleData.hasOwnProperty(moduleID)) return;
				this.start(moduleID);
			}
		},
		stop: function (moduleID) {
			var data;
			if (data == moduleData[moduleID] && data.instance) {
				this.log(1, 'Stop module ' + moduleID + ' Falied: module does not exist or has not been started.');
				return;
			}
			data.instance.destroy();
			data.instance = null;
		},
		stopAll: function () {
			var moduleID;
			for (moduleID in moduleData) {
				if (!moduleData.hasOwnProperty(moduleID)) return;
				this.stop(moduleID);
			}
		},
		registerEvents: function (evts, mod) {
			if (this.is_obj(evts) && mod) {
				if (!moduleData[mod]) {
					this.log(1, '');
					return;
				}
				moduleData[mod].events = evts;
			}
		},
		triggerEvent: function (evt) {
			var mod;
			for (mod in moduleData) {
				if (!moduleData.hasOwnProperty(mod)) return;
				mod = moduleData[mod];
				if (mod.events && mod.events[evt.type]) {
					mod.events[evt.type](evt.data);
				}
			}
		},
		removeEvents: function (evts, mod) {
			if (this.is_obj(evts) && mod && (mod = moduleData[mod]) && mod.events) {
				delete mod.events;
			}
		},
		log: function (severity, message) {
			if (debug) {
				console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
			} else {
				// send error to server
			}
		},
		dom: {
			query: function (selector, context) {
				//console.log(selector);
				var ret = {}, self = this, jqEls, i = 0;
				if (context && context.find) { // context is jquery object which has children of this object
					jqEls = context.find(selector);
				} else {
					jqEls = jQuery(selector);
					// console.log(selector);
				}

				ret = jqEls.get(); // here is the problem
				ret.length = jqEls.length;
				ret.query = function (sel) {
					//console.log(jqEls);
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
					jQuery(element).bind(evt, fn);
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
				jQuery(el).attr(attrs);
			}
		},
		is_arr: function (arr) {
			return jQuery.isArray(arr);
		},
		is_obj: function (obj) {
			return jQuery.isPlainObject(obj);
		}
	}
}());


