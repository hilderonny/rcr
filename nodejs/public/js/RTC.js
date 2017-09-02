if (typeof(Comm) === 'undefined') throw new Error('Class Comm not found. Missed including /js/Comm.js?');
if (typeof(WebRTCConnection) === 'undefined') throw new Error('Class WebRTCConnection not found. Missed including /js/WebRTCConnection.js?');

/**
 * Class for providing WebRTC video and audio connections between connected socket.
 * 
 * @param {any} localMediaProperties Configuration object for navigator.mediaDevices.getUserMedia
 */
function RTC(localMediaProperties) {
    
    Comm.call(this);
    
    var self = this;

    self.sockets = {};
    self.localStreams = [];
    
    self.localIdTags = document.querySelectorAll('localId');
    self.remoteClientButtonsTags = document.querySelectorAll('remoteClientButtons');
    self.localVideosTags = document.querySelectorAll('localVideos');
    self.remoteVideosTags = document.querySelectorAll('remoteVideos');

    self.handleRemoteStream = function(stream) {
        var objectUrl = window.URL.createObjectURL(stream);
        self.remoteVideosTags.forEach(function(remoteVideosTag) {
            var video = document.createElement('video');
            video.setAttribute('autoplay', true);
            remoteVideosTag.appendChild(video);
            video.src = objectUrl;
        });
    }

    self.connectToClient = function(socketId) {
        var connection = new WebRTCConnection(self.socket, socketId);
        connection.on('remoteStream', self.handleRemoteStream);
        self.localStreams.forEach(connection.addLocalStream);
        connection.connect();
    };

    self.on('connect', function(socket) {
        self.localIdTags.forEach(function(localIdTag) {
            localIdTag.innerText = socket.id;
        });
    });

    self.on('socketConnected', function(socketIds) {
        socketIds.forEach(function(socketId) {
            var socket = { tags: [] };
            self.sockets[socketId] = socket;
            self.remoteClientButtonsTags.forEach(function(remoteClientButtonsTag) {
                var button = document.createElement('button');
                button.socketId = socketId;
                button.innerHTML = socketId;
                button.addEventListener('click', function() {
                    self.connectToClient(button.socketId);
                    button.classList.add('active');
                });
                remoteClientButtonsTag.appendChild(button);
                socket.tags.push(button);
            });
        });
    });

    self.on('socketDisconnected', function(socketId) {
        self.sockets[socketId].tags.forEach(function(tag) {
            tag.parentNode.removeChild(tag);
        });
        delete self.sockets[socketId];
    });

    self.on('message', function(message) {
        switch(message.type) {
            case 'WebRTCConnectionConnect': 
                var connection = new WebRTCConnection(self.socket, message.from, message.content.sessionDescription);
                connection.on('remoteStream', self.handleRemoteStream);
                self.localStreams.forEach(connection.addLocalStream);
                connection.accept();
                break;
                /*

            case 'WebRTCclientDisconnected': self.removeRemoteClient(message.content); break;
            case 'WebRTCclientList': self.handleClientListFromServer(message.content); break;
            case 'WebRTCcall': self.handleIncomingCall(message.from, message.content.connectionId, message.content.sessionDescription); break;
            case 'WebRTCaccept': self.handleCallAccepted(message.content.connectionId, message.content.sessionDescription); break;
            case 'WebRTCreject': self.handleCallRejected(message.content); break;
            case 'WebRTCiceCandidate': self.handleRemoteIceCandidate(message.content.connectionId, message.content.remoteIceCandidateDescription); break;
            case 'WebRTCthumbnail': self.handleRemoteThumbnail(message.from, message.content); break;
            case 'WebRTCclose': self.handleCallClosed(message.content); break;
            */
        }

    });

    // Init local video capturing
    if (!localMediaProperties) localMediaProperties = { audio: true, video: true };
    navigator.mediaDevices.enumerateDevices().then(function(devices) {
        devices.forEach(function(device) {
            if (device.kind !== 'videoinput') return;
            // See https://stackoverflow.com/a/33770656/5964970
            localMediaProperties.video = { deviceId: { exact: device.deviceId } };
            navigator.mediaDevices.getUserMedia(localMediaProperties).then(function(stream) {
                self.localStreams.push(stream);
                var objectUrl = window.URL.createObjectURL(stream);
                self.localVideosTags.forEach(function(localVideosTag) {
                    var video = document.createElement('video');
                    video.setAttribute('autoplay', true);
                    video.setAttribute('muted', true);
                    localVideosTag.appendChild(video);
                    video.src = objectUrl;
                });
            });
        });
    });
    
}
