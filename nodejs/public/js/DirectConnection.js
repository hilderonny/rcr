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

    self.connectToDevice = function(client, device) {
        self.peerConnection = new RTCPeerConnection();
        self.peerConnection.onaddstream = self.handleAddStream;
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

    self.id = new Date().getTime().toString();
}