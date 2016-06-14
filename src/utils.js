var utils = {};

utils.qs = function(selector, context) {
	context = context || document;
	return context.querySelector(selector);
};

utils.qsa = function(selector, context) {
	context = context || document;
	return context.querySelectorAll(selector);
};

utils.wait = function(ms, cb) {
	return window.setTimeout(cb, (ms || 500));
};

utils.isDevMode = function() {
	return window && window.location.hostname === 'localhost';
};

if (typeof Object.assign != 'function') {
	(function () {
		Object.assign = function (target) {
			'use strict';
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var output = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source !== undefined && source !== null) {
					for (var nextKey in source) {
						if (source.hasOwnProperty(nextKey)) {
							output[nextKey] = source[nextKey];
						}
					}
				}
			}
			return output;
		};
	})();
}

module.exports = utils;