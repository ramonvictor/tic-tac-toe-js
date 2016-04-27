// Application
// --------------
var utils = require('./utils');
var scoreView = require('./score-view');
var gridView = require('./grid-view');
var store = require('./store');
var events = require('./events');
var socket = io();

function TicTacToe() {
	this.winner = require('./winner');
}

TicTacToe.prototype.init = function(config) {
	this.$table = utils.qs(config.gridElement);
	this.$players = utils.qs(config.playersElement);

	this.gameId = config.gameId;

	this.scoreView = scoreView(this.$players);
	this.gridView = gridView(this.$table);

	this.eventListeners();
};

TicTacToe.prototype.eventListeners = function() {
	this.$table.addEventListener('click', this.onCellClick.bind(this));
	events.on('store:update', this.onStoreUpdate.bind(this));
	socket.on('connect', this.onSocketConnect.bind(this));
	socket.on('dispatch', this.onSocketDispatch.bind(this));
};

TicTacToe.prototype.onSocketConnect = function(data) {
	socket.emit('room', this.gameId);
};

TicTacToe.prototype.onSocketDispatch = function(data) {
	store.dispatch(data);
};

TicTacToe.prototype.onCellClick = function(event) {
	var target = event.target;
	var classes = target.classList;
	var index = target.dataset.index;
	var state = store.getState();

	if (!classes.contains('js-cell') || classes.contains('is-filled') ||
		(state.player.length && state.turn !== state.player)) {
		return;
	}

	// Dispatch update cell action
	this.updateCell(state, index);
};

TicTacToe.prototype.updateCell = function(state, index) {
	var action = {
		type: state.turn === 'x' ? 'SET_X' : 'SET_O',
		index: parseInt(index, 10),
		gameId: this.gameId
	};

	// Pick player side
	if (!state.player.length) {
		store.dispatch({
			type: 'PICK_SIDE',
			side: state.turn
		});
	}

	// Dispatch action
	store.dispatch(action);
	socket.emit('dispatch', action);
};

TicTacToe.prototype.onStoreUpdate = function(event) {
	var data = event.detail;

	// Render
	this.render(data.prevState, data.state);

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
	store.dispatch({
		type: 'SHOW_WINNER',
		winner: lastTurn,
		sequence: winnerSeq
	});

	this.restartGame();
};

TicTacToe.prototype.render = function(prevState, state) {
	if (prevState.grid !== state.grid) {
		this.gridView.render('grid', state.grid);
	}

	if (prevState.turn !== state.turn) {
		this.scoreView.render('turn', state.turn);
	}

	if (prevState.score !== state.score) {
		this.scoreView.render('score', state.score);
	}

	if (prevState.winnerSequence !== state.winnerSequence) {
		this.gridView.render('winner', state.winnerSequence);
	}
};


TicTacToe.prototype.restartGame = function() {
	utils.wait(1500).then(function() {
		store.dispatch({
			type: 'RESTART_GAME'
		});
	});
};

module.exports = new TicTacToe();

