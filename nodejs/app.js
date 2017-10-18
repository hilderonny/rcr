var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var socketio = require('socket.io');
var five = require('johnny-five');

// Anwendung initialisieren und Handler-Reihenfolge festlegen
var app = express();
app.use(express.static(__dirname + '/public')); // Statische Ressourcen im public-Verzeichnis, lädt bei root-Aufruf automatisch index.html
app.use('/node_modules', express.static(__dirname + '/node_modules')); // Node Module als statische Verweise bereit stellen, damit angular geladen werden kann

// Webserver Express Instanz
var server = https.createServer({ 
    key: fs.readFileSync('./priv.key', 'utf8'), 
    cert: fs.readFileSync('./pub.cert', 'utf8')
}, app);
// Socket.io Instanz
var io = socketio(server);

// Liste verbundener Sockets
var sockets = {};

var upDownRange = [50, 170];
var leftRightRange = [10, 170];
var upDownServo = null;
var leftRightServo = null;

io.on('connection', (socket) => {
    sockets[socket.id] = socket;
    socket.on('disconnect', () => {
        delete sockets[socket.id];
        //console.log(`Socket ${socket.id} disconnected.`);
        socket.broadcast.emit('Message', {
            type: 'WebRTCclientDisconnected',
            content: socket.id
        });
    });
    socket.on('Message', (message) => {
        message.from = socket.id;
        if (message.type === 'WebRTCclientName') {
            socket.name = message.content;
        }
        if (message.to) {
            sockets[message.to].emit('Message', message);
            //console.log(`Sent message type "${message.type}" from ${message.from} to ${message.to}`);
        } else {
            socket.broadcast.emit('Message', message);
            //console.log(`Sent message type "${message.type}" from ${message.from} to all other`);
        }
    });
    // Movement commands from clients are reditected to the arduino
    // attached on COM port defined at top
    socket.on('Move', (movement) => { 
        if (upDownServo) upDownServo.to(five.Fn.scale(movement.x, -45, 45, upDownRange[0], upDownRange[1]));
        if (leftRightServo) leftRightServo.to(five.Fn.scale(movement.y, -90, 90, leftRightRange[0], leftRightRange[1]));
    });
    //console.log(`Socket ${socket.id} connected.`);
    socket.broadcast.emit('Message', {
        type: 'WebRTCclientConnected',
        content: socket.id
    });
    socket.emit('Message', {
        type: 'WebRTCclientList',
        content: Object.keys(sockets).filter((id) => id !== socket.id).map((id) => {
            return { id: id, name: sockets[id].name }
        })
    });
});

var board = new five.Board();
board.on('ready', function() {
    upDownServo = new five.Servo({
        pin: 13,
        range: upDownRange,
        center: true
    });
    leftRightServo = new five.Servo({
        pin: 12,
        range: leftRightRange,
        center: true
    });
});

// Server starten
server.listen(443, () => {
    console.log(`HTTP laeuft an Port 443.`);
});
http.createServer((req, res) => {
    // When redirecting, the correct port must be used. But the original request can also have a port which must be stripped.
    var indexOfColon = req.headers.host.lastIndexOf(':');
    var hostWithoutPort = indexOfColon > 0 ? req.headers.host.substring(0, indexOfColon) : req.headers.host;
    var newUrl = `https://${hostWithoutPort}:443${req.url}`;
    res.writeHead(302, { 'Location': newUrl }); // http://stackoverflow.com/a/4062281
    res.end();
}).listen(80, function() {
    console.log(`HTTP laeuft an Port 80.`);
});
