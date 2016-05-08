// Application
// --------------
var utils = require('./utils');
var scoreView = require('./score-view');
var gridView = require('./grid-view');
var fiveiconView = require('./fiveicon-view');
var store = require('./store');
var socket = io();

function TicTacToe() {
	this.winner = require('./winner');
}

TicTacToe.prototype.init = function(config) {
	this.$head = document.head || utils.qs('head');
	this.$table = utils.qs(config.gridElement);
	this.$players = utils.qs(config.playersElement);

	this.room = config.room;

	this.scoreView = scoreView(this.$players);
	this.gridView = gridView(this.$table);
	this.fiveiconView = fiveiconView(this.$head);

	this.eventListeners();
};

TicTacToe.prototype.eventListeners = function() {
	this.$table.addEventListener('click', this.onCellClick.bind(this));

	store.subscribe(this.render.bind(this));
	store.subscribe(this.checkWinner.bind(this));

	socket.on('connect', this.onSocketConnect.bind(this));
	socket.on('dispatch', this.onSocketDispatch.bind(this));
};

TicTacToe.prototype.onSocketConnect = function(data) {
	socket.emit('room', this.room);
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
		this.shouldPreventClick(state)) {
		return;
	}

	this.updateCell(state, index);
};

TicTacToe.prototype.shouldPreventClick = function(state) {
	var isNotMyTurn = (state.player.length && state.turn !== state.player);
	var isGameFinished = (state.winnerSequence.length > 0);

	return isNotMyTurn || isGameFinished;
};

TicTacToe.prototype.updateCell = function(state, index) {
	var action = {
		type: state.turn === 'x' ? 'SET_X' : 'SET_O',
		index: parseInt(index, 10),
		room: this.room
	};

	if (!state.player.length) {
		store.dispatch({
			type: 'PICK_SIDE',
			side: state.turn
		});
	}

	store.dispatch(action);
	socket.emit('dispatch', action);
};

TicTacToe.prototype.render = function(prevState, state) {
	if (prevState.grid !== state.grid) {
		this.gridView.render('grid', state.grid);
	}

	if (prevState.turn !== state.turn) {
		this.scoreView.render('turn', state.turn);
		this.fiveiconView.render(state.turn);
	}

	if (prevState.score !== state.score) {
		this.scoreView.render('score', state.score);
	}

	if (prevState.winnerSequence !== state.winnerSequence) {
		this.gridView.render('winner', state.winnerSequence);
	}

	if (!prevState.winnerSequence.length && state.turnCounter === 9) {
		this.restartGame();
	}
};

TicTacToe.prototype.checkWinner = function(prevState, state) {
	var self = this;
	var lastTurn = prevState.turn;

	this.winner
		.check(state.grid, lastTurn)
		.then(function(winnerSeq) {
			self.showWinner(lastTurn, winnerSeq);
		});
};

TicTacToe.prototype.showWinner = function(lastTurn, sequence) {
	store.dispatch({
		type: 'SHOW_WINNER',
		winner: lastTurn,
		sequence: sequence
	});

	this.restartGame();
};

TicTacToe.prototype.restartGame = function() {
	utils.wait(1500).then(function() {
		store.dispatch({
			type: 'RESTART_GAME'
		});
	});
};

module.exports = new TicTacToe();
