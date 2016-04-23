function Winner() {
	this.dimensions = [this.getRows(), this.getColumns(), this.getDiagonals()];
}

Winner.prototype.check = function(prevState, state) {
	return this.checkAll(state.grid, prevState.turn);
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

Winner.prototype.checkAll = function(grid, lastTurn) {
	var dIndex = 0;
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
				return true;
			}
			// Reset counter each three indexes
			if ((i + 1) % 3 === 0) {
				counter = { x: 0, o: 0 };
			}
		}

		dIndex++;
	}

	return false;
};

