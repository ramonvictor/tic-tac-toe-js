// Application
// --------------
function TicTacToe() {
	this.store = new Store();
}

TicTacToe.prototype.init = function(config) {
	this.$table = qs(config.gridElement);
	this.$tableCell = qsa('.js-cell', this.$table);

	this.$players = qs(config.playersElement);
	this.$playerTurn = qsa('.js-player-turn', this.$players);

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
};

TicTacToe.prototype.render = function(event) {
	var data = event.detail;

	if (data.prevState.grid !== data.state.grid) {
		this.renderGrid(data.state.grid);
	}

	if (data.prevState.turn !== data.state.turn) {
		this.renderTurn(data.state.turn);
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
