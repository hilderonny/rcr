if (typeof(io) === 'undefined') throw new Error('Socket.io not found. Missed including /socket.io/socket.io.js?');

function Client() {

    var self = this;

    self.deviceList = [];
    self.eventHandlers = {};
    self.serverConnection = null;
    self.directConnections = {};

    self.connectToDevice = function(device) {
        var directConnection = new DirectConnection();
        self.directConnections[directConnection.id] = directConnection;
        directConnection.connectToDevice(self, device);
    };

    self.connectToServer = function() {
        self.serverConnection = io();
        self.serverConnection.on('message', function(message) { self.handleMessage.call(this, message); });
        self.serverConnection.on('deviceList', function(deviceList) { self.handleDeviceList.call(this, deviceList); });
    };

    self.emit = function(eventName, data) {
        var handlersForEvent = self.eventHandlers[eventName];
        if (!handlersForEvent || handlersForEvent.length < 1) return;
        handlersForEvent.forEach(function(handler) { handler(data); });
    }

    self.findDevices = function() {
        navigator.mediaDevices.enumerateDevices().then(function(devices) {
            devices.forEach(self.registerDevice);
        });
    };

    self.handleAcceptConnectionToDevice = function(message) {
        var directConnection = self.directConnections[message.content.connectionId];
        directConnection.handleAnswer(message.content.answer);
    };
    
    self.handleDeviceList = function(deviceList) {
        self.deviceList = deviceList;
        self.emit('deviceList', deviceList);
    };

    self.handleMessage = function(message) {
        switch (message.type) {
            case 'acceptConnectionToDevice': self.handleAcceptConnectionToDevice(message); break;
            case 'requestConnectionToDevice': self.handleRequestConnectionToDevice(message); break;
        }
    };

    self.handleRequestConnectionToDevice = function(message) {
        var directConnection = new DirectConnection();
        self.directConnections[directConnection.id] = directConnection;
        directConnection.acceptIncomingConnection(self, message.from, message.content.connectionId, message.content.deviceId, message.content.offer);
    };

    self.on = function(eventName, callback) {
        if (!self.eventHandlers[eventName]) {
            self.eventHandlers[eventName] = [ callback ];
        } else {
            self.eventHandlers[eventName].push(callback);
        }
    };

    self.registerDevice = function(device) {
        self.serverConnection.emit('registerDevice', device);
    };

    self.sendMessage = function(targetSocketId, messageType, messageContent) {
        var message = {
            to: targetSocketId,
            type: messageType,
            content: messageContent
        };
        self.serverConnection.emit('message', message);
    };

    self.connectToServer();
    self.findDevices();

}