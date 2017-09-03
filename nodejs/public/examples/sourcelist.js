if (typeof(Comm) === 'undefined') throw new Error('Class Comm not found. Missed including /js/Comm.js?');

function SourceList() {

    Comm.call(this);

    var self = this;

    self.localIdTags = document.querySelectorAll('localId');
    self.clientListTags = document.querySelectorAll('clientList');
    self.remoteSockets = [];
    
    // When the local socket sonnected to the server, it got an id which is shown in the localId tag
    self.on('connect', function(socket) {
        self.localIdTags.forEach(function(t) {
            t.innerText = socket.id;
        });
        // Init local video capturing, after connecting to the server
        var localMediaProperties = { audio: true, video: true };
        navigator.mediaDevices.enumerateDevices().then(function(devices) {
            devices.forEach(function(device) {
                if (device.kind !== 'videoinput') return;
                self.send('videoinput', device);
            });
        });
    });

    // When a remote socket connected or we get an initial list of sockets, show a div for it
    self.on('socketConnected', function(socketIds) {
        socketIds.forEach(function(socketId) {
            var socket = { tags: [] }; // tag contains a reference to the dom elements representing the socket
            self.remoteSockets[socketId] = socket;
            self.clientListTags.forEach(function(t) {
                var clientTag = document.createElement('client');
                clientTag.socketId = socketId;
                clientTag.innerHTML = '<label>' + socketId + '</label>';
                t.appendChild(clientTag);
                socket.tags.push(clientTag);
            });
        });
    });

    // When a remote socket diconnected, remove all DOM elements for it
    self.on('socketDisconnected', function(socketId) {
        self.remoteSockets[socketId].tags.forEach(function(tag) {
            tag.parentNode.removeChild(tag);
        });
        delete self.remoteSockets[socketId];
    });

    // When a remote client sent information about a video input device
    self.on('videoinput', function(message) {
        var remoteSocket = self.remoteSockets[message.from];
        if (!remoteSocket) return;
        remoteSocket.tags.forEach(function(t) {
            var sourceTag = document.createElement('source');
            sourceTag.device = message.content;
            sourceTag.innerHTML = message.content.label;
            t.appendChild(sourceTag);
        });
    });

    // TODO: Die Daten der einzelnen Clients müssen auf dem Server gespeichert werden, damit Neuankömmlinge diese nicht bei den existierenden Clients abfragen müssen.
    
}

window.onload = function() {

    var sourceList = new SourceList();
    
};
