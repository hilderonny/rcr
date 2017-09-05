var WebServer = require('./WebServer');
var socketio = require('socket.io');

class SocketServer {

    constructor() {
        this.deviceList = [];
        this.socketIoInstance = null;
    }

    handleDeviceRegistration(socketForDevice, deviceToRegister) {
        deviceToRegister.socketId = socketForDevice.id;
        this.deviceList.push(deviceToRegister);
        console.log(`Registered device "${deviceToRegister.deviceId}" (${deviceToRegister.kind} / ${deviceToRegister.label}) from ${socketForDevice.id}`);
        this.sendDeviceList();
    }

    handleMessage(sendingSocket, messageToHandle) {
        messageToHandle.from = sendingSocket.id;
        if (messageToHandle.to) {
            var targetSocket = this.socketIoInstance.sockets.sockets[messageToHandle.to];
            if (!targetSocket) return;
            targetSocket.emit('message', messageToHandle);
            console.log(`Sent message "${messageToHandle.type}" from ${messageToHandle.from} to ${messageToHandle.to}`);
        } else {
            sendingSocket.broadcast.emit('message', messageToHandle);
            console.log(`Sent message "${messageToHandle.type}" from ${messageToHandle.from} to all other`);
        }
    }

    handleSocketConnect(connectedSocket) {
        connectedSocket.on('disconnect', () => { this.handleSocketDisconnect.call(this, connectedSocket); });
        connectedSocket.on('registerDevice', (device) => { this.handleDeviceRegistration.call(this, connectedSocket, device); });
        connectedSocket.on('message', (message) => { this.handleMessage.call(this, connectedSocket, message); });
        this.sendDeviceList(connectedSocket);
        console.log(`Socket ${connectedSocket.id} connected.`);
    }

    handleSocketDisconnect(disconnectedSocket) {
        this.deviceList = this.deviceList.filter((d) => d.socketId !== disconnectedSocket.id);
        this.sendDeviceList();
        console.log(`Socket ${disconnectedSocket.id} disconnected.`);
    }

    sendDeviceList(targetSocket) {
        (targetSocket ? targetSocket : this.socketIoInstance).emit('deviceList', this.deviceList);
    }

    start(httpsServerToAttachTo) {
        this.socketIoInstance = socketio(httpsServerToAttachTo);
        this.socketIoInstance.on('connection', (socket) => { this.handleSocketConnect.call(this, socket); });
    }

}

module.exports = SocketServer;