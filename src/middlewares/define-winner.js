var utils = require('../utils');
var winnerService = require('../winner-service');
var actions = require('../actions');

module.exports = function defineWinner(store) {
	return function(next) {
		return function(action) {
			var winnerSeq;
			var prevState = store.getState();
			var lastTurn = prevState.turn;

			// Dispatch action
			var result = next(action);

			// Get new state
			var state = store.getState();

			// Check winner
			if (action.type !== 'SHOW_WINNER' && action.type !== 'RESTART_GAME') {
				winnerSeq = winnerService.check(state.grid, lastTurn);

				if (winnerSeq.length > 0) {
					store.dispatch(actions.showWinner(lastTurn, winnerSeq));

					utils.wait(1500, function() {
						store.dispatch(actions.restart());
					});
				}
			}

			return result;
		};
	};
};