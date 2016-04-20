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
	var prevState = this.state;

	this.state = this.update(this.state, action);
	this.emit(prevState, this.state);
};

Store.prototype.emit = function(prevState, state) {
	var event = new CustomEvent('store:update', {
		detail: {
			previousState: prevState,
			state: state
		}
	});

	document.dispatchEvent(event);
};

Store.prototype.update = function(state, action) {
	return {
		grid: state.grid.map(function(c, i) {
			return (action.index === i) ? updateCell(c, action) : c;
		}),
		turn: toggleTurn(state.turn, action)
	};
};

function updateCell(state, action) {
	switch (action.type) {
		case 'SET_X':
			return 'x';
		case 'SET_O':
			return 'o';
		default:
			return state;
	}
}

function toggleTurn(state, action) {
	switch (action.type) {
		case 'SET_X':
			return 'o';
		case 'SET_O':
			return 'x';
		default:
			return state;
	}
}