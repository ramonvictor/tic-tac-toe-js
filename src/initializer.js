document.addEventListener('DOMContentLoaded', function() {
	var hash = window.location.hash;

	if (!hash || hash.length < 2) {
		window.location.href = window.location.href + '#' +
			(((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}

	var T = require('./game');

	T.init({
		gridElement: '.js-table',
		playersElement: '.js-players-display',
		gameId: window.location.hash.replace('#', '')
	});

}, false);