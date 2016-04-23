var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

io.on('connection', function(socket) {
	socket.on('dispatch', function(data) {
		socket.broadcast.emit('dispatch', data);
	});
});

var port = process.env.PORT || 3000;

http.listen(3000, function() {
  // console.log('listening on *:3000');
});