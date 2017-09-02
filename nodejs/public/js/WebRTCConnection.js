if (typeof(EventEmitter) === 'undefined') throw new Error('Class EventEmitter not found. Missed including /js/EventEmitter.js?');

function WebRTCConnection(socket, remoteSocketId, remoteDescription) {

    EventEmitter.call(this);
    
    var self = this;

    self.remoteSocketId = remoteSocketId;
    self.socket = socket;
    self.id = remoteSocketId + (new Date()).getTime();
    self.peerConnection = new RTCPeerConnection(null);

    if (remoteDescription) self.peerConnection.setRemoteDescription(new RTCSessionDescription(remoteDescription));

    self.addLocalStream = function(localStream) {
        self.peerConnection.addStream(localStream);
    };

    self.close = function() {
        if (self.isClosed) return;
        self.isClosed = true;
        self.peerConnection.close();
        self.socket.emit('message', {
            to: self.remoteSocketId,
            type: 'WebRTCConnectionClose',
            content: self.id
        });
    };

    self.addRemoteIceCandidate = function(remoteIceCandidateDescription) {
        self.peerConnection.addIceCandidate(new RTCIceCandidate(remoteIceCandidateDescription));
    };

    self.connect = function() {
        self.peerConnection.createOffer().then(function(localSessionDescription) {
            self.peerConnection.setLocalDescription(localSessionDescription);
            self.socket.emit('message', {
                to: self.remoteSocketId,
                type: 'WebRTCConnectionConnect',
                content: {
                    connectionId: self.id,
                    sessionDescription: localSessionDescription
                }
            });
        });
        self.socket.on('message', function(message) {
            switch (message.type) {
                case 'WebRTCConnectionConnectAccept':
                    self.peerConnection.setRemoteDescription(new RTCSessionDescription(message.content.sessionDescription));
                    break;
                case 'WebRTCConnectionConnectIceCandidate':
                    self.peerConnection.addIceCandidate(new RTCIceCandidate(message.content.remoteIceCandidateDescription));
                    break;
            }
        });
    };

    self.accept = function() {
        return self.peerConnection.createAnswer().then(function(localSessionDescription) {
            self.peerConnection.setLocalDescription(localSessionDescription);
            self.socket.emit('message', {
                to: self.remoteSocketId,
                type: 'WebRTCConnectionConnectAccept',
                content: { connectionId: self.id, sessionDescription: localSessionDescription }
            });
            return Promise.resolve();
        });
    };
    
    self.peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            self.socket.emit('message', {
                to: self.remoteSocketId,
                type: 'WebRTCConnectionConnectIceCandidate',
                content: { connectionId: self.id, remoteIceCandidateDescription: event.candidate }
            });
        }
    };

    self.peerConnection.onaddstream = function(event) {
        self.emit('remoteStream', event.stream);
    };

    self.peerConnection.closeConnection = self.close;
    self.peerConnection.onremovestream = self.close;

}
