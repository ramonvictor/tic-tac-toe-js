// Application
// --------------
function TicTacToe() {
	this.store = new Store();
	this.events = new Events();
	this.winner = new Winner();

	this.turnCounter = 0;
}

TicTacToe.prototype.init = function(config) {
	this.$table = qs(config.gridElement);
	this.$tableCell = qsa('.js-cell', this.$table);

	this.$players = qs(config.playersElement);
	this.$playerTurn = qsa('.js-player-turn', this.$players);
	this.$playerScore = qsa('.js-player-score', this.$players);

	this.eventListeners();
};

TicTacToe.prototype.eventListeners = function() {
	this.$table.addEventListener('click', this.onCellClick.bind(this));
	this.events.on('store:update', this.onStoreUpdate.bind(this));
};

TicTacToe.prototype.onCellClick = function(event) {
	var target = event.target;
	var classList = target.classList;
	var state;

	if (!classList.contains('js-cell') || classList.contains('is-filled')) {
		return;
	}

	state = this.store.getState();

	this.store.dispatch({
		type: state.turn === 'x' ? 'SET_X' : 'SET_O',
		index: parseInt(target.dataset.index, 10)
	});
};

TicTacToe.prototype.onStoreUpdate = function(event) {
	var self = this;
	var data = event.detail;
	var winnerSeq;

	this.render(data.prevState, data.state);

	winnerSeq = this.winner.check(data.prevState, data.state);
	if (Array.isArray(winnerSeq)) {
		this.finishGame(data.prevState.turn, winnerSeq);
	}
};

TicTacToe.prototype.finishGame = function(lastTurn, winnerSeq) {
	var self = this;

	self.store.dispatch({
		type: 'SHOW_WINNER',
		winner: lastTurn,
		sequence: winnerSeq
	});

	this.wait(1000).then(function() {
		self.store.dispatch({
			type: 'RESTART_GAME'
		});
	});
};

TicTacToe.prototype.render = function(prevState, state) {
	if (prevState.grid !== state.grid) {
		this.renderGrid(state.grid);
	}

	if (prevState.turn !== state.turn) {
		this.renderTurn(state.turn);
	}

	if (prevState.score !== state.score) {
		this.renderScore(state.score);
	}

	if (prevState.winnerSequence !== state.winnerSequence) {
		this.renderWinnerSequence(state.winnerSequence);
	}
};

TicTacToe.prototype.renderGrid = function(grid) {
	var self = this;
	var selected = 'is-filled';

	grid.forEach(function(cell, index) {
		var output = '';
		var $cell = self.$tableCell[index];

		$cell.classList.remove(selected);

		if (cell.length > 0) {
			output = '<div class="' + cell + '"></div>';
			$cell.classList.add(selected);
		}

		$cell.innerHTML = output;
	});
};

TicTacToe.prototype.renderWinnerSequence = function(winnerSequence) {
	var self = this;
	var div;

	winnerSequence.forEach(function(ind) {
		div = qs('div', self.$tableCell[ind]);
		div.classList.add('is-winner-cell');
	});
};

TicTacToe.prototype.renderTurn = function(turn) {
	if (turn === 'o') {
		this.$playerTurn[0].classList.remove('is-selected');
		this.$playerTurn[1].classList.add('is-selected');
	} else {
		this.$playerTurn[1].classList.remove('is-selected');
		this.$playerTurn[0].classList.add('is-selected');
	}
};

TicTacToe.prototype.renderScore = function(score) {
	this.$playerScore[0].innerHTML = score.x;
	this.$playerScore[1].innerHTML = score.o;
};

TicTacToe.prototype.wait = function(ms) {
	ms = ms || 500;
	return new Promise(function(resolve, reject){
		window.setTimeout(function() {
			resolve();
		}, ms);
	});
};

// Helpers
// --------------
function qs(selector, context) {
	context = context || document;
	return context.querySelector(selector);
}

function qsa(selector, context) {
	context = context || document;
	return context.querySelectorAll(selector);
}
