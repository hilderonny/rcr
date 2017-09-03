if (typeof(Comm) === 'undefined') throw new Error('Class Comm not found. Missed including /js/Comm.js?');

function SourceList() {

    Comm.call(this);

    var self = this;

    self.localIdTags = document.querySelectorAll('localId');
    self.clientListTags = document.querySelectorAll('clientList');
    self.remoteSocketInfos = [];
    
    // When the local socket sonnected to the server, it got an id which is shown in the localId tag
    self.on('connect', function(socket) {
        self.localIdTags.forEach(function(t) {
            t.innerText = socket.id;
        });
        // Init local video capturing, after connecting to the server
        var localMediaProperties = { audio: true, video: true };
        navigator.mediaDevices.enumerateDevices().then(function(devices) {
            var videoDevices = devices.filter(function(d) { return d.kind === 'videoinput' });
            self.send('socketInfo', { devices: videoDevices });
        });
    });

    self.handleDevices = function(sourcesTag, devices) {
        devices.forEach(function(device) {
            var sourceTag = document.createElement('source');
            sourceTag.device = device;
            sourceTag.innerHTML = device.label;
            sourcesTag.appendChild(sourceTag);
        });
    };

    // When a remote socket connected or we get an initial list of sockets, show a div for it
    self.on('socketConnected', function(socketInfos) {
        socketInfos.forEach(function(socketInfo) {
            socketInfo.tags = []; // tag contains a reference to the dom elements representing the socket
            self.remoteSocketInfos[socketInfo.id] = socketInfo;
            self.clientListTags.forEach(function(t) {
                var clientTag = document.createElement('client');
                clientTag.socketInfo = socketInfo;
                clientTag.innerHTML = '<label>' + socketInfo.id + '</label>';
                var sourcesTag = document.createElement('sources');
                clientTag.appendChild(sourcesTag);
                t.appendChild(clientTag);
                socketInfo.tags.push(clientTag);
                if (socketInfo.devices) self.handleDevices(sourcesTag, socketInfo.devices);
            });
        });
    });

    // When a remote socket diconnected, remove all DOM elements for it
    self.on('socketDisconnected', function(socketId) {
        self.remoteSocketInfos[socketId].tags.forEach(function(tag) {
            tag.parentNode.removeChild(tag);
        });
        delete self.remoteSocketInfos[socketId];
    });

    // When a remote client sent information about a video input device
    self.on('socketInfo', function(message) {
        console.log(message);
        var remoteSocketInfo = self.remoteSocketInfos[message.from];
        // TODO: Weiter hier
        /*
        var remoteSocketInfo = self.remoteSocketInfos[message.from];
        self.handleSocketInfos(message.content);
        if (!remoteSocketInfo) return;
        remoteSocketInfo.tags.forEach(function(t) {
            var sourceTag = document.createElement('source');
            sourceTag.device = message.content;
            sourceTag.innerHTML = message.content.label;
            t.appendChild(sourceTag);
        });*/
    });
    
}

window.onload = function() {

    var sourceList = new SourceList();
    
};
