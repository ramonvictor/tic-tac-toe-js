document.addEventListener('DOMContentLoaded', function() {
	var w = window;
	var hash = w.location.hash;

	if (!hash || hash.length < 2) {
		w.location.href = w.location.href + '#' +
			(((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}

	var T = require('./game');

	T.init({
		gridElement: '.js-table',
		playersElement: '.js-players-display',
		gameId: w.location.hash.replace('#', '')
	});

}, false);