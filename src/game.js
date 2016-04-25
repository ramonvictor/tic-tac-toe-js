// Application
// --------------
var utils = require('./utils');

function TicTacToe() {
	this.socket = io();
	this.store = require('./store');
	this.events = require('./events');
	this.winner = require('./winner');
}

TicTacToe.prototype.init = function(config) {
	this.$table = utils.qs(config.gridElement);
	this.$players = utils.qs(config.playersElement);

	this.gameId = config.gameId;

	this.scoreView = require('./score-view')(this.$players);
	this.gridView = require('./grid-view')(this.$table);

	this.eventListeners();
};

TicTacToe.prototype.eventListeners = function() {
	this.$table.addEventListener('click', this.onCellClick.bind(this));
	this.events.on('store:update', this.onStoreUpdate.bind(this));
	this.socket.on('dispatch', this.onSocketDispatch.bind(this));
};

// TODO: fix this with socket channel
TicTacToe.prototype.onSocketDispatch = function(data) {
	if (data.gameId === this.gameId) {
		this.store.dispatch(data);
	}
};

TicTacToe.prototype.onCellClick = function(event) {
	var target = event.target;
	var classes = target.classList;
	var index = target.dataset.index;

	if (!classes.contains('js-cell') || classes.contains('is-filled')) {
		return;
	}

	// Dispatch update cell action
	this.updateCell(index);
};

TicTacToe.prototype.updateCell = function(index) {
	var state = this.store.getState();
	var action = {
		type: state.turn === 'x' ? 'SET_X' : 'SET_O',
		index: parseInt(index, 10),
		gameId: this.gameId
	};

	// Dispatch action
	this.store.dispatch(action);
	this.socket.emit('dispatch', action);
};

TicTacToe.prototype.onStoreUpdate = function(event) {
	var data = event.detail;
	var winnerSeq;

	// Render
	this.render(data.prevState, data.state);

	// Check winner
	// TODO: move this to proper place
	this.checkWinner(data.prevState, data.state);
};

TicTacToe.prototype.checkWinner = function(prevState, state) {
	var winnerSeq = this.winner.check(prevState, state);

	if (Array.isArray(winnerSeq)) {
		this.showWinner(prevState.turn, winnerSeq);
	} else if (state.turnCounter === 9) {
		this.restartGame();
	}
};

TicTacToe.prototype.showWinner = function(lastTurn, winnerSeq) {
	this.store.dispatch({
		type: 'SHOW_WINNER',
		winner: lastTurn,
		sequence: winnerSeq
	});

	this.restartGame();
};

TicTacToe.prototype.render = function(prevState, state) {
	if (prevState.grid !== state.grid) {
		this.gridView.render(state.grid, 'grid');
	}

	if (prevState.turn !== state.turn) {
		this.scoreView.render(state.turn, 'turn');
	}

	if (prevState.score !== state.score) {
		this.scoreView.render(state.score, 'score');
	}

	if (prevState.winnerSequence !== state.winnerSequence) {
		this.gridView.render(state.winnerSequence, 'winner');
	}
};


TicTacToe.prototype.restartGame = function() {
	var self = this;

	this.wait(1500).then(function() {
		self.store.dispatch({
			type: 'RESTART_GAME'
		});
	});
};

TicTacToe.prototype.wait = function(ms) {
	ms = ms || 500;
	return new Promise(function(resolve, reject){
		window.setTimeout(function() {
			resolve();
		}, ms);
	});
};

module.exports = new TicTacToe();

