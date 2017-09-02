if (typeof(EventEmitter) === 'undefined') throw new Error('Class EventEmitter not found. Missed including /js/EventEmitter.js?');
if (typeof(io) === 'undefined') throw new Error('Socket.io not found. Missed including /socket.io/socket.io.js?');

function Comm() {
    EventEmitter.call(this);
    
    var self = this;

    self.socket = io();

    // Triggered when websocket connection to server was established. Now the self.socket.id is available
    self.socket.on('connect', function() {
        self.emit('connect', this);
    });

    // Triggered, when a foreign socket connected to the server
    self.socket.on('socketConnected', function(socketIds) {
        self.emit('socketConnected', socketIds);
    });

    // Triggered, when a foreign socket disconnected from the server
    self.socket.on('socketDisconnected', function(socketId) {
        self.emit('socketDisconnected', socketId);
    });
    
    // Triggered when a message was received from the server (or from another socket)
    self.socket.on('message', function(message) {
        self.emit('message', message);
    });
}
