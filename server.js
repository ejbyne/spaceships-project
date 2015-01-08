var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socket = require('./src/socketsController.js')(io);

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

server.listen(port, function() {
  console.log('Server listening on port ' + port);
});

module.exports = server;