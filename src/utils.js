var utils = {};

utils.qs = function(selector, context) {
	context = context || document;
	return context.querySelector(selector);
};

utils.qsa = function(selector, context) {
	context = context || document;
	return context.querySelectorAll(selector);
};

utils.wait = function(ms) {
	ms = ms || 500;
	return new Promise(function(resolve, reject){
		window.setTimeout(function() {
			resolve();
		}, ms);
	});
};

module.exports = utils;