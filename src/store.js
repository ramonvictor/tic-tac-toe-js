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

	this.state.winnerSequence = [];
	this.state.turnCounter = 0;
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
			return (action.index === i || action.type === 'RESTART_GAME') ?
				updateCell(c, action) : c;
		}),
		turn: updateTurn(state.turn, action),
		score: updateScore(state.score, action),
		winnerSequence: updateWinnerSequence(state.winnerSequence, action),
		turnCounter: updateCounter(state.turnCounter, action)
	};
};

function updateCell(state, action) {
	switch (action.type) {
		case 'SET_X':
			return 'x';
		case 'SET_O':
			return 'o';
		case 'RESTART_GAME':
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
		case 'RESTART_GAME':
			return 'x';
		default:
			return state;
	}
}

function updateScore(state, action) {
	var s;

	switch (action.type) {
		case 'SHOW_WINNER':
			s = {};
			s[action.winner] = state[action.winner];
			s[action.winner]++;
			return Object.assign({}, state, s);
		default:
			return state;
	}
}

function updateWinnerSequence(state, action) {
	switch (action.type) {
		case 'SHOW_WINNER':
			return action.sequence.slice();
		case 'RESTART_GAME':
			return [];
		default:
			return state;
	}
}

function updateCounter(state, action) {
	switch (action.type) {
		case 'SET_X':
			return state + 1;
		case 'SET_O':
			return state + 1;
		case 'RESTART_GAME':
			return 0;
		default:
			return state;
	}
}

