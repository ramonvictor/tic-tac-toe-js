document.addEventListener('DOMContentLoaded', function() {
	var hash = window.location.hash;

	if (!hash || hash.length < 2) {
		window.location.href = window.location.href + '#' +
			(((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}

	var T = require('./game');
	var room = window.location.hash;
	var refreshForm = document.getElementById('refresh-game-form');
	var roomField = document.getElementById('room-id');

	T.init({
		gridElement: '.js-table',
		playersElement: '.js-players-display',
		room: room.replace('#', '')
	});

	// Display room id
	roomField.value = room;

	// Force refresh
	refreshForm.addEventListener('submit', function(event) {
		event.preventDefault();
		window.location.hash = roomField.value.replace('#', '');
		document.location.reload(false);
	}, false);


}, false);