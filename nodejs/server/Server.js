var WebServer = require('./WebServer');
var SocketServer = require('./SocketServer');

/**
 * Server encapsuling a web server and an attached socket server
 */
class Server {

    /**
     * Creates instance for web an socket server but does not start it yet.
     * Must be started with start(httpPort, httpsPort).
     */
    constructor() {
        this.webServer = new WebServer();
        this.socketServer = new SocketServer();
    }
    
    /**
     * (Re-)Starts the web server on the given ports and restarts the socket server.
     * @param {number} httpPort Port on which the webserver listens to HTTP requests (e.g. 80)
     * @param {number} httpsPort Port on which the webserver listens to HTTPS requests (e.g. 443)
     */
    start(httpPort, httpsPort) {
        this.webServer.start(httpPort, httpsPort);
        this.socketServer.start(this.webServer.httpsServer);
    }
    
}

module.exports = Server;