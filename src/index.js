// Application
// --------------
function TicTacToe() {
	this.store = new Store();
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
	var self = this;

	toArray(this.$tableCell).forEach(function(cell) {
		cell.addEventListener('click', self.onCellClick.bind(self));
	});

	document.addEventListener('store:update', this.render.bind(this), false);
};

TicTacToe.prototype.onCellClick = function(event) {
	var target = event.currentTarget;
	var state;
	if (target.classList.contains('is-filled')) {
		return;
	}

	state = this.store.getState();

	this.store.dispatch({
		type: state.turn === 'x' ? 'SET_X' : 'SET_O',
		index: parseInt(target.dataset.index, 10)
	});

	window.setTimeout(function() {
		this.addTurn();
	}.bind(this), 1000);
};

TicTacToe.prototype.addTurn = function() {
	this.turnCounter = this.turnCounter + 1;
	// At least 5 turns would be necessary to have a winner.
	if (this.turnCounter > 4) {
		this.checkWinner();
	}
};

TicTacToe.prototype.render = function(event) {
	var data = event.detail;

	if (data.prevState.grid !== data.state.grid) {
		this.renderGrid(data.state.grid);
	}

	if (data.prevState.turn !== data.state.turn) {
		this.renderTurn(data.state.turn);
	}

	if (data.prevState.score !== data.state.score) {
		this.renderScore(data.state.score);
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

TicTacToe.prototype.checkWinner = function() {
	var directions = [[0, 1, 2, 3, 4, 5, 6, 7, 8], // rows
							[0, 3, 6, 1, 4, 7, 2, 5, 8], // columns
							[0, 4, 8, 2, 4, 6]]; // diagonals

	var state = this.store.getState();
	var lastTurn = this.store.getPrevState().turn;
	var winner = this.checkIndexes(directions, state.grid, lastTurn);

	if (winner) {
		this.turnCounter = 0;
		this.store.dispatch({
			type: 'END_GAME',
			winner: lastTurn
		});
	}
};


TicTacToe.prototype.checkIndexes = function(directions, grid, lastTurn) {
	var dIndex = 0;
	var counter;
	var index;
	var i;

	while (directions[dIndex]) {
		counter = { x: 0, o: 0 };

		for (i = 0; i < directions[dIndex].length; i++) {
			index = directions[dIndex][i];
			// Increment counter
			counter[grid[index]]++;
			// Break loop if there's a winner
			if (counter[lastTurn] === 3) {
				return true;
			}
			// Reset counter each three indexes
			if ((i + 1) % 3 === 0) {
				counter = { x: 0, o: 0 };
			}
		}

		dIndex++;
	}

	return false;
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

function toArray(arr) {
	return [].slice.call(arr);
}
