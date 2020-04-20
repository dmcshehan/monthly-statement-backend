var http = require('http');
var app = require('./app');


var server = http.createServer(app);
var port = process.env.PORT || 5000;


server.listen(port);