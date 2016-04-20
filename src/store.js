// Store
// --------------
function Store() {
	this.state = {};
	this.state.grid = ['', '', '', '', '', '', '', '', ''];
	this.state.turn = 'x';
	this.turnCounter = 0;

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
	this.prevState = this.state;

	this.state = this.update(this.state, action);

	this.emit(this.prevState, this.state);
	this.checkWinner();
};

Store.prototype.emit = function(prevState, state) {
	var event = new CustomEvent('store:update', {
		detail: {
			prevState: prevState,
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

Store.prototype.checkWinner = function() {
	this.turnCounter = this.turnCounter + 1;

	// It's not possible to win with less
	// than five turns, so return.
	if (this.turnCounter < 5) {
		return;
	}

	this.checkRows();
	this.checkColumns();
	this.checkDiagonals();
};

Store.prototype.checkRows = function() {
	var regex = new RegExp(this.prevState.turn, 'g');
	var rows = [this.state.grid.slice(0, 3).join(''),
					this.state.grid.slice(3, 6).join(''),
					this.state.grid.slice(6, 9).join('')];

	rows.forEach(function(row) {
		if (row.match(regex) && row.match(regex).length === 3) {
			console.log(this.prevState.turn, ' wins!');
		}
	}.bind(this));
};

Store.prototype.checkColumns = function() {
};

Store.prototype.checkDiagonals = function() {
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