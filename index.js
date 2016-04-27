var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

io.on('connection', function(socket) {
	socket.on('room', function(room) {
		socket.join(room);
	});

	socket.on('dispatch', function(data) {
		socket.broadcast.to(data.room)
			.emit('dispatch', data);
	});
});

http.listen(port);