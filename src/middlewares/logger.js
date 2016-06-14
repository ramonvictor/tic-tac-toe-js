var utils = require('../utils');

module.exports = function logger(store) {
	return function(next) {
		return function(action) {
			if (!utils.isDevMode()) {
				return next(action);
			}

			console.groupCollapsed(action.type);
					console.group('action:');
						console.log(JSON.stringify(action, '', '\t'));
					console.groupEnd();
					console.groupCollapsed('previous state:');
						console.log(JSON.stringify(store.getState(), '', '\t'));
					console.groupEnd();
					var result = next(action);
					console.groupCollapsed('state:');
						console.log(JSON.stringify(store.getState(), '', '\t'));
					console.groupEnd();
			console.groupEnd();
			return result;
		};
	};
};