var utils = require('./utils');

function ScoreView(players) {
	this.$playerTurn = utils.qsa('.js-player-turn', players);
	this.$playerScore = utils.qsa('.js-player-score', players);
}

ScoreView.prototype.render = function(what, data) {
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