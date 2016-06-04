var actions = {};

actions.pickSide = function(turn) {
	return {
		type: 'PICK_SIDE',
		side: turn
	};
};

actions.setCell = function(turn, index, room) {
	return {
		type: turn === 'x' ? 'SET_X' : 'SET_O',
		index: parseInt(index, 10),
		room: room
	};
};

actions.showWinner = function(lastTurn, winnerSeq) {
	return {
		type: 'SHOW_WINNER',
		winner: lastTurn,
		sequence: winnerSeq
	};
};

actions.restart = function() {
	return {
		type: 'RESTART_GAME'
	};
};

module.exports = actions;