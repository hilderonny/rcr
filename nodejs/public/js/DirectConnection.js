function DirectConnection() {

    var self = this;

    self.peerConnection = null;

    self.close = function() {
        if (self.peerConnection) {
            self.peerConnection.close();
            self.peerConnection = null;
        }
    };

    self.handleAddStream = function(obj) {
        console.log(obj);
        var videoElement = document.createElement("video");
        document.appendChild(videoElement);
        videoElement.srcObject = obj.stream;
        videoElement.play();
    };

    self.handleLocalIceCandidate = function(client, socketId, event) {
        console.log(event);
        client.sendMessage(socketId, 'informAboutIceCandidate', { connectionId: self.id, candidate: event.candidate });
    };

    self.handleRemoteIceCandidate = function(candidate) {
        console.log(candidate);
        self.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    self.connectToDevice = function(client, device) {
        self.peerConnection = new RTCPeerConnection();
        self.peerConnection.onaddstream = self.handleAddStream;
        self.peerConnection.onicecandidate = function(event) { self.handleLocalIceCandidate(client, device.socketId, event); };
        var offer;
        self.peerConnection.createOffer().then(function(o) {
            offer = o;
            return self.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        }).then(function() {
            var messageContent = {
                deviceId: device.deviceId,
                connectionId: self.id,
                offer: offer
            };
            client.sendMessage(device.socketId, 'requestConnectionToDevice', messageContent);
        });
    };

    self.acceptIncomingConnection = function(client, sourceSocketId, sourceConnectionId, deviceId, offer) {
        self.peerConnection = new RTCPeerConnection();
        self.peerConnection.onaddstream = self.handleAddStream;
        self.peerConnection.onicecandidate = function(event) { self.handleLocalIceCandidate(client, sourceSocketId, event); };
        var answer;
        var constraints = {
            audio: true,
            video: { deviceId: { exact: deviceId } }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            self.peerConnection.addStream(stream);
            return self.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        }).then(function() {
            return self.peerConnection.createAnswer();
        }).then(function(a) {
            answer = a;
            return self.peerConnection.setLocalDescription(new RTCSessionDescription(answer));
        }).then(function() {
            var messageContent = {
                connectionId: sourceConnectionId,
                answer: answer
            };
            client.sendMessage(sourceSocketId, 'acceptConnectionToDevice', messageContent);
        });
    };

    self.handleAnswer = function(answer) {
        self.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };

    // TODO: ICE Kandidaten austauschen

    self.id = new Date().getTime().toString();
}