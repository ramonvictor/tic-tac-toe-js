var utils = require('./utils');

function GridView(table) {
	this.$tableCell = utils.qsa('.js-cell', table);
}

GridView.prototype.render = function(what, data) {
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
