function Winner(grid, lastTurn) {
	this.dimensions = [this.getRows(), this.getColumns(), this.getDiagonals()];
}

Winner.prototype.check = function(grid, lastTurn) {
	return this.hasWinner(grid, lastTurn);
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

	return [];
};


module.exports = new Winner();
