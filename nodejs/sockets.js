//@ts-check
const WebServer = require('./webserver');
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
        this.sockets = {};
        this.io.on('connection', (socket) => { this.onConnection.call(this, socket); }); // Pass correct scope
    }

    /**
     * Event is triggered, when a client disconnects.
     * The socket is removed from the internal list so that it will not get
     * any messages anymore.
     * @param {SocketIO.Socket} socket Socket which just disconnected.
     */
    onDisconnect(socket) {
        delete this.sockets[socket.id];
        console.log(`Socket ${socket.id} disconnected.`);
    }

    /**
     * Event is triggered, when a client connects to the server.
     * Remembers the connection in the pool and attachs event handlers to the socket.
     * @param {SocketIO.Socket} socket Newly created socket from a client
     */
    onConnection(socket) {
        this.sockets[socket.id] = socket;
        socket.on('disconnect', () => { this.onDisconnect.call(this, socket); });
        socket.on('msg', (message) => { this.onMessage.call(this, socket, message); });
        console.log(`Socket ${socket.id} connected.`);
    }

    /**
     * TODO: Implement and Extract class for message type
     * @param {SocketIO.Socket} senderSocket 
     * @param {any} message 
     */
    onMessage(senderSocket, message) {

    }

}

module.exports = Sockets;