var app = require("./app");
var http = require('http');
var port = 3000;

var server = http.createServer(app);
server.listen(port);