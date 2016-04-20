// Application
// --------------
function TicTacToe() {
	this.store = new Store();
}

TicTacToe.prototype.init = function(config) {
	this.$table = document.querySelector(config.gridElement);
	this.$tableCell = this.$table.querySelectorAll('.js-cell');

	this.$playersDisplay = document.querySelector(config.playersElement);
	this.$playerTurn = this.$playersDisplay.querySelectorAll('.js-player-turn');

	this.eventListeners();
};

TicTacToe.prototype.eventListeners = function() {
	var self = this;

	this.toArray(this.$tableCell).forEach(function(cell) {
		cell.addEventListener('click', self.onCellClick.bind(self));
	});

	document.addEventListener('store:update', this.render.bind(this), false);
};

TicTacToe.prototype.onCellClick = function(event) {
	var target = event.currentTarget;

	this.store.dispatch({
		type: 'UPDATE_CELL',
		index: target.dataset.index
	});
};

TicTacToe.prototype.render = function(event) {
	var data = event.detail;

	if (data.previousState.grid !== data.state.grid) {
		this.renderGrid(data.state.grid);
	}

	if (data.previousState.turn !== data.state.turn) {
		this.renderTurn(data.state.turn);
	}
};

TicTacToe.prototype.renderGrid = function(grid) {
	var self = this;

	grid.forEach(function(cell, index) {
		var output = '';

		if (cell.length > 0) {
			output = '<div class="' + cell + '"></div>';
		}

		self.$tableCell[index].innerHTML = output;
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

TicTacToe.prototype.toArray = function(arr) {
	return [].slice.call(arr);
};
