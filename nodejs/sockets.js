var WebServer = require('./webserver');
var socketio = require('socket.io');

/**
 * Websocket handler for transferring messages between clients
 */
class Sockets {

    /**
     * Create the socket.io instance and connects it to the given webserver
     * 
     * @param {WebServer} webServerInstance Webserver instance to attache the websocket to
     */
    constructor(webServerInstance) {
        this.webServerInstance = webServerInstance;
        this.io = socketio(webServerInstance.httpsServer);
        this.io.on('connection', (socket) => { this.onConnection.call(this, socket); }); // Pass correct scope
    }

    /**
     * Event is triggered, when a client disconnects.
     * The socket is removed from the internal list so that it will not get
     * any messages anymore.
     * @param {SocketIO.Socket} socket Socket which just disconnected.
     */
    onDisconnect(socket) {
        socket.broadcast.emit('socketDisconnected', socket.id);
        console.log(`Socket ${socket.id} disconnected.`);
    }

    /**
     * Event is triggered, when a client connects to the server.
     * Remembers the connection in the pool and attachs event handlers to the socket.
     * @param {SocketIO.Socket} socket Newly created socket from a client
     */
    onConnection(socket) {
        socket.on('disconnect', () => { this.onDisconnect.call(this, socket); });
        socket.on('message', (message) => { this.onMessage.call(this, socket, message); });
        // Inform other connected clients about the new socket
        socket.broadcast.emit('socketConnected', [socket.id]);
        // Inform the newly connected socket about the already registered sockets
        var connectedSocketIds = Object.keys(this.io.sockets.sockets).filter((id) => id !== socket.id);
        socket.emit('socketConnected', connectedSocketIds);
        console.log(`Socket ${socket.id} connected.`);
    }

    /**
     * Event is fired when a message was received from a sending socket.
     * Forwards the message to the receiver or broadcasts it when no receiver is given.
     * 
     * @param {SocketIO.Socket} senderSocket Socket wich sent the message
     * @param {any} message Message to forward or to process
     */
    onMessage(senderSocket, message) {
        message.from = senderSocket.id;
        if (message.to) {
            if (this.io.sockets.sockets[message.to]) {
                this.io.sockets.sockets[message.to].emit('message', message);
                console.log(`Sent message "${message.type}" from ${message.from} to ${message.to}`);
            }
        } else {
            senderSocket.broadcast.emit('message', message);
            console.log(`Sent message "${message.type}" from ${message.from} to all other`);
        }
    }

}

module.exports = Sockets;