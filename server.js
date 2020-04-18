var http = require('http');
var app = require('./app');

var server = http.createServer(app);

server.listen(process.env.PORT || 5000);