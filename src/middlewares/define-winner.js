var utils = require('../utils');
var winnerService = require('../winner');
var actions = require('../actions');

module.exports = function defineWinner(store) {
	return function defineWinnerGetDispatch(next) {
		return function(action) {
			var prevState = store.getState();
			var lastTurn = prevState.turn;

			// Dispatch action
			var result = next(action);

			// Get new state
			var state = store.getState();

			// Check winner
			if (action.type !== 'SHOW_WINNER' &&
				action.type !== 'RESTART_GAME') {
				winnerService
					.check(state.grid, lastTurn)
					.then(function(winnerSeq) {
						store.dispatch(actions.showWinner(lastTurn, winnerSeq));

						utils.wait(1500).then(function() {
							store.dispatch(actions.restart());
						});
					});
			}

			return result;
		};
	};
};