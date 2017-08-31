//@ts-check
const WebServer = require('./webserver');
const Sockets = require('./sockets');

var webserver = new WebServer(80, 443);
var sockets = new Sockets(webserver);

webserver.start();

