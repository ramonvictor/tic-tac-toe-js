document.addEventListener('DOMContentLoaded', function() {
	var hash = window.location.hash;

	// Generate room id
	// ---------------
	if (!hash || hash.length < 2) {
		window.location.href = window.location.href + '#' +
			(((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}

	// Define variables
	// ---------------
	var game = require('./game');
	var utils = require('./utils');
	var room = window.location.hash;
	var refreshForm = utils.qs('#refresh-game-form');
	var roomField = utils.qs('#room-id');
	var popOver = utils.qs('#pop-over');
	var storage = window.localStorage;

	// Init game
	// ---------------
	game({
		gridElement: '.js-table',
		playersElement: '.js-players-display',
		room: room.replace('#', '')
	});

	// Display room id
	// ----------------
	roomField.value = room.replace('#', '');

	// Force refresh
	// ---------------
	refreshForm.addEventListener('submit', function(event) {
		event.preventDefault();
		window.location.hash = roomField.value;
		document.location.reload(false);
	}, false);

	// Pop-over logic
	// ---------------
	if (!storage.getItem('ttt-pop-over-shown')) {
		popOver.style.display = 'block';

		popOver.addEventListener('click', function() {
			popOver.classList.add('hide');
			utils.wait(300, function() {
				popOver.style.display = 'none';
				storage.setItem('ttt-pop-over-shown', 1);
			});
		});
	}

}, false);
