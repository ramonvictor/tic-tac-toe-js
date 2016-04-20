// Store
// --------------
function Store() {
	this.state = {};
	this.state.grid = ['', '', '', '', '', '', '', '', ''];
	this.state.turn = 'x';
	// TODO
	this.state.turnCounter = '00:30';
}

Store.prototype.getState = function(action) {
	return this.state;
};

Store.prototype.dispatch = function(action) {
	var previousState = this.state;
	var event;

	this.state = this.update(this.state, action);

	event = new CustomEvent('store:update', {
		detail: {
			previousState: previousState,
			state: this.state
		}
	});

	document.dispatchEvent(event);
};

Store.prototype.update = function(state, action) {
	switch (action.type) {
		case 'ADD_X':
			return {
				grid: addX(state.grid, action.index),
				turn: 'o'
			};
		case 'ADD_O':
			return {
				grid: addO(state.grid, action.index),
				turn: 'x'
			};
		default:
			return state;
	}
};

function addX(grid, index) {
	var newGrid = grid.slice();
	newGrid[index] = 'x';

	return newGrid;
}

function addO(grid, index) {
	var newGrid = grid.slice();
	newGrid[index] = 'o';

	return newGrid;
}

// Application
// --------------
function TicTacToe() {
	this.store = new Store();
}

TicTacToe.prototype.init = function(context) {
	this.$table = document.querySelector(context);
	this.$tableCell = [].slice.call(this.$table.querySelectorAll('.js-cell'));
	this.$playerTurn = [].slice.call(document.querySelectorAll('.js-player-turn'));

	this.eventListers();
};

TicTacToe.prototype.eventListers = function() {
	var self = this;

	this.$tableCell.forEach(function(cell) {
		cell.addEventListener('click', self.onCellClick.bind(self));
	});

	document.addEventListener('store:update', this.render.bind(this), false);
};

TicTacToe.prototype.onCellClick = function(event) {
	var target = event.currentTarget;
	var state = this.store.getState();
	var action_type = state.turn === 'x' ? 'ADD_X' : 'ADD_O';

	this.store.dispatch({
		type: action_type,
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
	var output;

	// Update grid
	grid.forEach(function(cell, index) {
		if (cell === '') {
			output = '';
		} else {
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
