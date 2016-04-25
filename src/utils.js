var utils = {};

utils.qs = function(selector, context) {
	context = context || document;
	return context.querySelector(selector);
};

utils.qsa = function(selector, context) {
	context = context || document;
	return context.querySelectorAll(selector);
};

module.exports = utils;