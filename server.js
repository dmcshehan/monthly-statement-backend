require('dotenv').config();

var http = require('http');
var app = require('./app');

var server = http.createServer(app);
var port = process.env.PORT || 5000;

server.listen(port, function () {
	console.log(`App is listening on port ${port}`);
});
