function Client() {

    var self = this;

    self.deviceList = [];
    self.eventHandlers = {};
    self.serverConnection = null;

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

    self.handleDeviceList = function(deviceList) {
        self.deviceList = deviceList;
        self.emit('deviceList', deviceList);
    };

    self.handleMessage = function(message) {

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

    self.connectToServer();
    self.findDevices();

}