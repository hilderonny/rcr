//@ts-check
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
     * @param {number} httpPort Port where the HTTP server should listen (e.g. 80)
     * @param {number} httpsPort Port where the HTTPS server should listen (e.g. 443)
     */
    constructor(httpPort, httpsPort) {
        this.httpPort = httpPort;
        this.httpsPort = httpsPort;
        this.app = express();
        this.app.use(express.static(__dirname + '/public'));
        this.httpsServer = https.createServer({ 
            key: fs.readFileSync('./priv.key', 'utf8'), 
            cert: fs.readFileSync('./pub.cert', 'utf8')
        }, this.app);
        this.httpServer = http.createServer((req, res) => {
            var indexOfColon = req.headers.host.lastIndexOf(':');
            var hostWithoutPort = indexOfColon > 0 ? req.headers.host.toString().substring(0, indexOfColon) : req.headers.host;
            var newUrl = `https://${hostWithoutPort}:${this.httpsPort}${req.url}`;
            res.writeHead(302, { 'Location': newUrl }); // http://stackoverflow.com/a/4062281
            res.end();
        });
        this.isRunning = false;
    }

    /**
     * Starts the webserver on the ports defined in constructor. When the server is already running,
     * it gets stopped and restarted again (with eventually updated ports)
     * @returns {Promise<WebServer>} Resolves, when the server started.
     */
    start() {
        var self = this;
        return new Promise((resolve, reject) => {
            var internalStart = function() {
                self.httpsServer.listen(self.httpsPort, () => {
                    console.log(`HTTPS running at port ${self.httpsPort}.`);
                });
                self.httpServer.listen(self.httpPort, function() {
                    console.log(`HTTP running at port ${self.httpPort}.`);
                });
                self.isRunning = true;
                resolve(self);
            };
            if (self.isRunning) {
                self.httpsServer.close(() => {
                    self.httpServer.close(internalStart);
                });
            } else {
                internalStart();
            }
        });
    }

}

module.exports = WebServer;