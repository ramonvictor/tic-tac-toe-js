// Store
// --------------
function Store() {
	this.state = {};
	this.state.grid = ['', '', '', '', '', '', '', '', ''];
	this.state.turn = 'x';

	// TODO
	this.state.turnTimer = '00:30';
	this.state.score = {
		player1: 0,
		player2: 0
	};
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
	return {
		grid: this.updateGrid(state, action),
		turn: this.updateTurn(state, action)
	};
};

Store.prototype.updateGrid = function(state, action) {
	var grid;

	switch (action.type) {
		case 'UPDATE_CELL':
			grid = state.grid.slice();
			grid[action.index] = state.turn;
			return grid;
		default:
			return state.grid;
	}
};

Store.prototype.updateTurn = function(state, action) {
	switch (action.type) {
		case 'UPDATE_CELL':
			return state.turn === 'x' ? 'o' : 'x';
		default:
			return state.turn;
	}
};