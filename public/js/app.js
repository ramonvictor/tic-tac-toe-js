/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	module.exports = __webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports) {

	function Events() {}

	Events.prototype.on = function(name, callback) {
		document.addEventListener(name, callback, false);
	};

	Events.prototype.trigger = function(name, data) {
		var event = new CustomEvent(name, {
			detail: data
		});

		document.dispatchEvent(event);
	};

	module.exports = new Events();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// Store
	// --------------
	function Store() {
		this.events = __webpack_require__(1);

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
			grid: updateGrid(state.grid, action),
			turn: updateTurn(state.turn, action),
			score: updateScore(state.score, action),
			winnerSequence: updateWinnerSequence(state.winnerSequence, action),
			turnCounter: updateCounter(state.turnCounter, action)
		};
	};

	function updateGrid(grid, action) {
		return grid.map(function(c, i) {
			return (action.index === i || action.type === 'RESTART_GAME') ?
				updateCell(c, action) : c;
		});
	}

	function updateCell(cell, action) {
		switch (action.type) {
			case 'SET_X':
				return 'x';
			case 'SET_O':
				return 'o';
			case 'RESTART_GAME':
				return '';
			default:
				return cell;
		}
	}

	function updateTurn(turn, action) {
		switch (action.type) {
			case 'SET_X':
				return 'o';
			case 'SET_O':
				return 'x';
			case 'RESTART_GAME':
				return 'x';
			default:
				return turn;
		}
	}

	function updateScore(score, action) {
		switch (action.type) {
			case 'SHOW_WINNER':
				var newScore = {};
				newScore[action.winner] = score[action.winner] + 1;
				return Object.assign({}, score, newScore);
			default:
				return score;
		}
	}

	function updateWinnerSequence(winnerSequence, action) {
		switch (action.type) {
			case 'SHOW_WINNER':
				return action.sequence.slice();
			case 'RESTART_GAME':
				return [];
			default:
				return winnerSequence;
		}
	}

	function updateCounter(turnCounter, action) {
		switch (action.type) {
			case 'SET_X':
				return turnCounter + 1;
			case 'SET_O':
				return turnCounter + 1;
			case 'RESTART_GAME':
				return 0;
			default:
				return turnCounter;
		}
	}

	module.exports = new Store();


/***/ },
/* 3 */
/***/ function(module, exports) {

	function Winner() {
		this.dimensions = [this.getRows(), this.getColumns(), this.getDiagonals()];
	}

	Winner.prototype.check = function(prevState, state) {
		return this.hasWinner(state.grid, prevState.turn);
	};

	Winner.prototype.getRows = function() {
		return [0, 1, 2, 3, 4, 5, 6, 7, 8];
	};

	Winner.prototype.getColumns = function() {
		return [0, 3, 6, 1, 4, 7, 2, 5, 8];
	};

	Winner.prototype.getDiagonals = function() {
		return [0, 4, 8, 2, 4, 6];
	};

	Winner.prototype.getSequence = function(index) {
		var sequences = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		];

		return sequences[index];
	};

	Winner.prototype.hasWinner = function(grid, lastTurn) {
		var dIndex = 0;
		var sequence = 0;
		var counter;
		var index;
		var i;

		while (this.dimensions[dIndex]) {
			counter = { x: 0, o: 0 };

			for (i = 0; i < this.dimensions[dIndex].length; i++) {
				index = this.dimensions[dIndex][i];

				// Increment counter
				counter[grid[index]]++;

				// Break loop if there's a winner
				if (counter[lastTurn] === 3) {
					return this.getSequence(sequence);
				}

				// Reset counter each three indexes
				if ((i + 1) % 3 === 0) {
					counter = { x: 0, o: 0 };
					sequence++;
				}
			}

			dIndex++;
		}

		return false;
	};

	module.exports = new Winner();




/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Application
	// --------------
	function TicTacToe() {
		this.socket = io();
		this.store = __webpack_require__(2);
		this.events = __webpack_require__(1);
		this.winner = __webpack_require__(3);
	}

	TicTacToe.prototype.init = function(config) {
		this.gameId = config.gameId;
		this.$table = qs(config.gridElement);
		this.$tableCell = qsa('.js-cell', this.$table);

		this.$players = qs(config.playersElement);
		this.$playerTurn = qsa('.js-player-turn', this.$players);
		this.$playerScore = qsa('.js-player-score', this.$players);

		this.eventListeners();
	};

	TicTacToe.prototype.eventListeners = function() {
		this.$table.addEventListener('click', this.onCellClick.bind(this));
		this.events.on('store:update', this.onStoreUpdate.bind(this));
		this.socket.on('dispatch', this.onSocketDispatch.bind(this));
	};

	// TODO: fix this with socket channel
	TicTacToe.prototype.onSocketDispatch = function(data) {
		if (data.gameId === this.gameId) {
			this.store.dispatch(data);
		}
	};

	TicTacToe.prototype.onCellClick = function(event) {
		var target = event.target;
		var classes = target.classList;
		var index = target.dataset.index;

		if (!classes.contains('js-cell') || classes.contains('is-filled')) {
			return;
		}

		// Dispatch update cell action
		this.updateCell(index);
	};

	TicTacToe.prototype.updateCell = function(index) {
		var state = this.store.getState();
		var action = {
			type: state.turn === 'x' ? 'SET_X' : 'SET_O',
			index: parseInt(index, 10),
			gameId: this.gameId
		};

		// Dispatch action
		this.store.dispatch(action);
		this.socket.emit('dispatch', action);
	};

	TicTacToe.prototype.onStoreUpdate = function(event) {
		var data = event.detail;
		var winnerSeq;

		// Render
		this.render(data.prevState, data.state);

		// Check winner
		// TODO: move this to proper place
		this.checkWinner(data.prevState, data.state);
	};

	TicTacToe.prototype.checkWinner = function(prevState, state) {
		var winnerSeq = this.winner.check(prevState, state);

		if (Array.isArray(winnerSeq)) {
			this.showWinner(prevState.turn, winnerSeq);
		} else if (state.turnCounter === 9) {
			this.restartGame();
		}
	};

	TicTacToe.prototype.showWinner = function(lastTurn, winnerSeq) {
		this.store.dispatch({
			type: 'SHOW_WINNER',
			winner: lastTurn,
			sequence: winnerSeq
		});

		this.restartGame();
	};

	TicTacToe.prototype.render = function(prevState, state) {
		if (prevState.grid !== state.grid) {
			this.renderGrid(state.grid);
		}

		if (prevState.turn !== state.turn) {
			this.renderTurn(state.turn);
		}

		if (prevState.score !== state.score) {
			this.renderScore(state.score);
		}

		if (prevState.winnerSequence !== state.winnerSequence) {
			this.renderWinnerSequence(state.winnerSequence);
		}
	};

	// TODO: move to grid component
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

	// TODO: move to grid component
	TicTacToe.prototype.renderWinnerSequence = function(seq) {
		var self = this;
		var div;

		seq.forEach(function(ind) {
			div = qs('div', self.$tableCell[ind]);
			div.classList.add('is-winner-cell');
		});
	};

	// TODO: move to score/turn component
	TicTacToe.prototype.renderTurn = function(turn) {
		if (turn === 'o') {
			this.$playerTurn[0].classList.remove('is-selected');
			this.$playerTurn[1].classList.add('is-selected');
		} else {
			this.$playerTurn[1].classList.remove('is-selected');
			this.$playerTurn[0].classList.add('is-selected');
		}
	};

	// TODO: move to score/turn component
	TicTacToe.prototype.renderScore = function(score) {
		this.$playerScore[0].innerHTML = score.x;
		this.$playerScore[1].innerHTML = score.o;
	};

	TicTacToe.prototype.restartGame = function() {
		var self = this;

		this.wait(1500).then(function() {
			self.store.dispatch({
				type: 'RESTART_GAME'
			});
		});
	};

	TicTacToe.prototype.wait = function(ms) {
		ms = ms || 500;
		return new Promise(function(resolve, reject){
			window.setTimeout(function() {
				resolve();
			}, ms);
		});
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

	module.exports = new TicTacToe();



/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	document.addEventListener('DOMContentLoaded', function() {
		var location = window.location;
		var hash = window.location.hash;

		var generateId = function() {
			return Math.floor((1 + Math.random()) * 0x10000)
						.toString(16).substring(1);
		};

		if (!hash || hash.length < 2) {
			location.href = location.href + '#' + generateId();
		}

		var T = __webpack_require__(4);

		T.init({
			gridElement: '.js-table',
			playersElement: '.js-players-display',
			gameId: hash.replace('#', '')
		});

	}, false);

/***/ }
/******/ ]);