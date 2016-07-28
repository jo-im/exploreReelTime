var express = require('express');
//app is a request handler
var app = express();
var http = require('http');

var socketIo = require('socket.io');
//start a webserver and initialize socket.io which is a server that integrates with HTTP server
//a HTTP server is requested and app is assigned as its request handler
var server = http.createServer(app);
var io = socketIo.listen(server);
//serves static assets when there is a request for '/' route
console.log('Should be serving static assets when there is a request in the home page');
server.listen(8080);
//array of all lines drawn
app.use(express.static(__dirname + '/../public'));
console.log('Server is running in port 8080');
var line_history = [];

//event-handler for new incoming connections
io.on('connection', function(socket) {
  
  //first send the history to the new client
  for (var i in line_history) {
  	socket.emit('draw_line', {line: line_history[i]});
  }

  //add handler for message type "draw_line"
  socket.on('draw_line', function(data) {
  	//add received line to history
  	line_history.push(data.line);
  	//send line to all clients
  	io.emit('draw_line', {line: data.line});
  });

});

