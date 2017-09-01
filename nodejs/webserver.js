var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

/**
 * Express webserver listening on HTTPS and HTTP ports.
 * HTTP requests are redirected to HTTPS, because it is needed for WebRTC
 * connections.
 * As SSL certificates the priv.key and pub.cert files are used.
 */
class WebServer {

    /**
     * Creates an instance of the webserver but does not start it. Use start() to get it running.
     */
    constructor() {
        this.app = express();
        this.app.use(express.static(__dirname + '/public'));
        this.httpsServer = https.createServer({ 
            key: fs.readFileSync('./priv.key', 'utf8'), 
            cert: fs.readFileSync('./pub.cert', 'utf8')
        }, this.app);
        this.httpServer = http.createServer((request, response) => {
            var indexOfColon = request.headers.host.lastIndexOf(':');
            var hostWithoutPort = indexOfColon > 0 ? request.headers.host.substring(0, indexOfColon) : request.headers.host;
            var newUrl = `https://${hostWithoutPort}:${this.httpsPort}${request.url}`;
            response.writeHead(302, { 'Location': newUrl }); // http://stackoverflow.com/a/4062281
            response.end();
        });
        this.isRunning = false;
    }

    internalStart(httpPort, httpsPort) {
        this.httpPort = httpPort;
        this.httpsPort = httpsPort;
        this.httpsServer.listen(httpsPort, () => {
            console.log(`HTTPS running at port ${httpsPort}.`);
            this.httpServer.listen(httpPort, () => {
                console.log(`HTTP running at port ${httpPort}.`);
                this.isRunning = true;
            });
        });
    }

    /**
     * Starts the webserver on the ports defined in constructor. When the server is already running,
     * it gets stopped and restarted again (with eventually updated ports)
     * 
     * @param {number} httpPort Port where the HTTP server should listen (e.g. 80)
     * @param {number} httpsPort Port where the HTTPS server should listen (e.g. 443)
     */
    start(httpPort, httpsPort) {
        if (this.isRunning) {
            this.httpsServer.close(() => {
                this.httpServer.close(() => {
                    this.internalStart.call(this, httpPort, httpsPort);
                });
            });
        } else {
            this.internalStart.call(this, httpPort, httpsPort);
        }
    }

}

module.exports = WebServer;