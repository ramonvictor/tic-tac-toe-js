document.addEventListener('DOMContentLoaded', function() {
	var location = window.location;
	var hash = window.location.hash;

	var generateId = function() {
		return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16).substring(1);
	};

	if (!hash || hash.length < 2) {
		location.href = location.href + '#' + generateId();
	}

	var T = require('./game');

	T.init({
		gridElement: '.js-table',
		playersElement: '.js-players-display',
		gameId: hash.replace('#', '')
	});

}, false);