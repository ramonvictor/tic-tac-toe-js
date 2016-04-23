// Store
// --------------
function Store() {
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

	this.emit(this.prevState, this.state);
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
	switch (action.type) {
		case 'END_GAME':
			var s = {};
			s[action.winner] = state[action.winner];
			s[action.winner]++;
			return Object.assign({}, state, s);
		default:
			return state;
	}
}
