function Events() {}

Events.prototype.on = function(name, callback) {
	document.addEventListener(name, callback, false);
};

Events.prototype.trigger = function(name, data) {
	var event = new CustomEvent(name, {
		detail: data
	});

	document.dispatchEvent(event);
};