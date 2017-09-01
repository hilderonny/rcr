const WebServer = require('./WebServer');
const Sockets = require('./Sockets');

var webServer = new WebServer();
var sockets = new Sockets(webServer);

webServer.start(80, 443);

