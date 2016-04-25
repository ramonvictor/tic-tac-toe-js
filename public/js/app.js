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
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	module.exports = __webpack_require__(8);


/***/ },
/* 1 */
/***/ function(module, exports) {

	var utils = {};

	utils.qs = function(selector, context) {
		context = context || document;
		return context.querySelector(selector);
	};

	utils.qsa = function(selector, context) {
		context = context || document;
		return context.querySelectorAll(selector);
	};

	utils.wait = function(ms) {
		ms = ms || 500;
		return new Promise(function(resolve, reject){
			window.setTimeout(function() {
				resolve();
			}, ms);
		});
	};

	module.exports = utils;

/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var events = __webpack_require__(2);

	function Store() {
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

		events
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
			var output = c;

			if (action.index === i || action.type === 'RESTART_GAME') {
				output = updateCell(c, action);
			}

			return output;
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
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(1);

	function ScoreView(players) {
		this.$playerTurn = utils.qsa('.js-player-turn', players);
		this.$playerScore = utils.qsa('.js-player-score', players);
	}

	ScoreView.prototype.render = function(data, what) {
		this[what](data);
	};


	ScoreView.prototype.score = function(score) {
		this.$playerScore[0].innerHTML = score.x;
		this.$playerScore[1].innerHTML = score.o;
	};

	ScoreView.prototype.turn = function(turn) {
		if (turn === 'o') {
			this.$playerTurn[0].classList.remove('is-selected');
			this.$playerTurn[1].classList.add('is-selected');
		} else {
			this.$playerTurn[1].classList.remove('is-selected');
			this.$playerTurn[0].classList.add('is-selected');
		}
	};

	module.exports = function(players) {
		return new ScoreView(players);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(1);

	function GridView(table) {
		this.$tableCell = utils.qsa('.js-cell', table);
	}

	GridView.prototype.render = function(data, what) {
		this[what](data);
	};

	GridView.prototype.grid = function(grid) {
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

	GridView.prototype.winner = function(seq) {
		var self = this;
		var div;

		seq.forEach(function(ind) {
			div = utils.qs('div', self.$tableCell[ind]);
			div.classList.add('is-winner-cell');
		});
	};

	module.exports = function(table) {
		return new GridView(table);
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// Application
	// --------------
	var utils = __webpack_require__(1);
	var scoreView = __webpack_require__(5);
	var gridView = __webpack_require__(6);
	var store = __webpack_require__(3);
	var events = __webpack_require__(2);
	var socket = io();

	function TicTacToe() {
		this.winner = __webpack_require__(4);
	}

	TicTacToe.prototype.init = function(config) {
		this.$table = utils.qs(config.gridElement);
		this.$players = utils.qs(config.playersElement);

		this.gameId = config.gameId;

		this.scoreView = scoreView(this.$players);
		this.gridView = gridView(this.$table);

		this.eventListeners();
	};

	TicTacToe.prototype.eventListeners = function() {
		this.$table.addEventListener('click', this.onCellClick.bind(this));
		events.on('store:update', this.onStoreUpdate.bind(this));
		socket.on('dispatch', this.onSocketDispatch.bind(this));
	};

	// TODO: fix this with socket channel
	TicTacToe.prototype.onSocketDispatch = function(data) {
		if (data.gameId === this.gameId) {
			store.dispatch(data);
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
		var state = store.getState();
		var action = {
			type: state.turn === 'x' ? 'SET_X' : 'SET_O',
			index: parseInt(index, 10),
			gameId: this.gameId
		};

		// Dispatch action
		store.dispatch(action);
		socket.emit('dispatch', action);
	};

	TicTacToe.prototype.onStoreUpdate = function(event) {
		var data = event.detail;

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
		store.dispatch({
			type: 'SHOW_WINNER',
			winner: lastTurn,
			sequence: winnerSeq
		});

		this.restartGame();
	};

	TicTacToe.prototype.render = function(prevState, state) {
		if (prevState.grid !== state.grid) {
			this.gridView.render(state.grid, 'grid');
		}

		if (prevState.turn !== state.turn) {
			this.scoreView.render(state.turn, 'turn');
		}

		if (prevState.score !== state.score) {
			this.scoreView.render(state.score, 'score');
		}

		if (prevState.winnerSequence !== state.winnerSequence) {
			this.gridView.render(state.winnerSequence, 'winner');
		}
	};


	TicTacToe.prototype.restartGame = function() {
		utils.wait(1500).then(function() {
			store.dispatch({
				type: 'RESTART_GAME'
			});
		});
	};

	module.exports = new TicTacToe();



/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	document.addEventListener('DOMContentLoaded', function() {
		var location = window.location;
		var hash = window.location.hash;

		if (!hash || hash.length < 2) {
			location.href = location.href + '#' +
				(((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}

		var T = __webpack_require__(7);

		T.init({
			gridElement: '.js-table',
			playersElement: '.js-players-display',
			gameId: hash.replace('#', '')
		});

	}, false);

/***/ }
/******/ ]);