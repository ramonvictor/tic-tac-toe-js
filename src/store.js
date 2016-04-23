// Store
// --------------
function Store() {
	this.events = new Events();

	this.prevState = {};
	this.state = {};
	this.state.grid = ['', '', '', '', '', '', '', '', ''];
	this.state.turn = 'x';
	this.state.score = {
		x: 0,
		o: 0
	};

	// TODO
	this.state.turnTimer = '00:30';
}

Store.prototype.getState = function(action) {
	return this.state;
};

Store.prototype.getPrevState = function(action) {
	return this.prevState;
};

Store.prototype.dispatch = function(action) {
	this.prevState = this.state;
	this.state = this.update(this.state, action);

	this.events
		.trigger('store:update', {
			prevState: this.prevState,
			state: this.state
		});
};

Store.prototype.update = function(state, action) {
	return {
		grid: state.grid.map(function(c, i) {
			return (action.index === i || action.type === 'END_GAME') ?
				updateCell(c, action) : c;
		}),
		turn: updateTurn(state.turn, action),
		score: updateScore(state.score, action)
	};
};

function updateCell(state, action) {
	switch (action.type) {
		case 'SET_X':
			return 'x';
		case 'SET_O':
			return 'o';
		case 'END_GAME':
			return '';
		default:
			return state;
	}
}

function updateTurn(state, action) {
	switch (action.type) {
		case 'SET_X':
			return 'o';
		case 'SET_O':
			return 'x';
		case 'END_GAME':
			return 'x';
		default:
			return state;
	}
}

function updateScore(state, action) {
	var s;

	switch (action.type) {
		case 'END_GAME':
			s = {};
			s[action.winner] = state[action.winner];
			s[action.winner]++;
			return Object.assign({}, state, s);
		default:
			return state;
	}
}
