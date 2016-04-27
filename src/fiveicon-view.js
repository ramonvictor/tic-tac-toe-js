function FaviconView(head) {
	this.$head = head;
}

FaviconView.prototype.render = function(turn) {
	var link = document.createElement('link');
	var oldLink = document.getElementById('favicon');
	var src = (turn === 'x') ? 'favicon.ico' : 'favicon-o.ico';

	link.id = 'favicon';
	link.rel = 'shortcut icon';
	link.href = src;

	if (oldLink) {
		this.$head.removeChild(oldLink);
	}

	this.$head.appendChild(link);
};

module.exports = function(head) {
	return new FaviconView(head);
};
