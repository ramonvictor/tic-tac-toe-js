// Store
// --------------
function Store() {
	this.events = require('./events');

	this.prevState = {};
	this.state = {};

	this.state.grid = ['', '', '', '', '', '', '', '', ''];

	this.state.turn = 'x';
	this.state.score = {
		x: 0,
		o: 0
	};

	this.state.winnerSequence = [];
	this.state.turnCounter = 0;
}

Store.prototype.getState = function(action) {
	return this.state;
};

Store.prototype.getPrevState = function(action) {
	return this.prevState;
};

Store.prototype.dispatch = function(action) {
	this.prevState = this.state;
	this.state = this.update(this.state, action);

	this.events
		.trigger('store:update', {
			prevState: this.prevState,
			state: this.state
		});
};

Store.prototype.update = function(state, action) {
	return {
		grid: updateGrid(state.grid, action),
		turn: updateTurn(state.turn, action),
		score: updateScore(state.score, action),
		winnerSequence: updateWinnerSequence(state.winnerSequence, action),
		turnCounter: updateCounter(state.turnCounter, action)
	};
};

function updateGrid(grid, action) {
	return grid.map(function(c, i) {
		return (action.index === i || action.type === 'RESTART_GAME') ?
			updateCell(c, action) : c;
	});
}

function updateCell(cell, action) {
	switch (action.type) {
		case 'SET_X':
			return 'x';
		case 'SET_O':
			return 'o';
		case 'RESTART_GAME':
			return '';
		default:
			return cell;
	}
}

function updateTurn(turn, action) {
	switch (action.type) {
		case 'SET_X':
			return 'o';
		case 'SET_O':
			return 'x';
		case 'RESTART_GAME':
			return 'x';
		default:
			return turn;
	}
}

function updateScore(score, action) {
	switch (action.type) {
		case 'SHOW_WINNER':
			var newScore = {};
			newScore[action.winner] = score[action.winner] + 1;
			return Object.assign({}, score, newScore);
		default:
			return score;
	}
}

function updateWinnerSequence(winnerSequence, action) {
	switch (action.type) {
		case 'SHOW_WINNER':
			return action.sequence.slice();
		case 'RESTART_GAME':
			return [];
		default:
			return winnerSequence;
	}
}

function updateCounter(turnCounter, action) {
	switch (action.type) {
		case 'SET_X':
			return turnCounter + 1;
		case 'SET_O':
			return turnCounter + 1;
		case 'RESTART_GAME':
			return 0;
		default:
			return turnCounter;
	}
}

module.exports = new Store();
