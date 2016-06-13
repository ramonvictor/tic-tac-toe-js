exports.pickSide = function(turn) {
	return {
		type: 'PICK_SIDE',
		side: turn
	};
};

exports.setCell = function(turn, index, room) {
	return {
		type: turn === 'x' ? 'SET_X' : 'SET_O',
		index: parseInt(index, 10),
		room: room
	};
};

exports.showWinner = function(lastTurn, winnerSeq) {
	return {
		type: 'SHOW_WINNER',
		winner: lastTurn,
		sequence: winnerSeq
	};
};

exports.restart = function() {
	return {
		type: 'RESTART_GAME'
	};
};