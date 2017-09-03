window.onload = function() {

    var rtc = new WebRTC({ audio: true, video: true}, true);

    var localIdTags = document.querySelectorAll('localId');
    var remoteClientButtonsTags = document.querySelectorAll('remoteClientButtons');
    var localVideosTags = document.querySelectorAll('localVideos');
    var remoteVideosTags = document.querySelectorAll('remoteVideos');

    var remoteClients = {};

    rtc.on('clientList', function(newClientList) {
        Object.keys(remoteClients).forEach((key) => {
            delete remoteClients[key];
        });
        Object.keys(newClientList).forEach(function(clientId) {
            var client = newClientList[clientId];
            $scope.addClient(client);
        });
    }).on('socketConnected', function(socketIds) {
        addClient(socketIds);
    }).on('socketDisconnected', function(socketId) {
        removeClient(socketId);
    }).on('clientChanged', function(changedClient) {
        var client = $scope.remoteClients[changedClient.id];
        if (!client) return;
        client.name = changedClient.name;
        $scope.$apply();
    }).on('localStream', function(localStream) {
        $scope.localVideoStreamUrl = window.URL.createObjectURL(localStream);
        document.getElementById('localVideoTag').src = $scope.localVideoStreamUrl;
    }).on('remoteStream', function(event) {
        var client = $scope.remoteClients[event.connection.remoteClientId];
        if (!client) return;
        client.remoteVideo = window.URL.createObjectURL(event.stream);
        $scope.$apply();
    }).on('clientThumbnail', function(changedClient) {
        var client = $scope.remoteClients[changedClient.id];
        if (!client) return;
        client.thumbnail = changedClient.thumbnail;
        $scope.$apply();
    }).on('incomingCallAccepted', function(connection) {
        var remoteClient = $scope.remoteClients[connection.remoteClientId];
        if (!remoteClient) return;
        remoteClient.isInCall = true;
        remoteClient.currentConnection = connection;
        $scope.$apply();
    }).on('connectionClosed', function(connection) {
        var remoteClient = $scope.remoteClients[connection.remoteClientId];
        if (!remoteClient) return;
        remoteClient.isInCall = false;
        $scope.$apply();
    });

    var addClient = function(socketIds) {
        remoteClients[client.id] = client;
        remoteClientButtonsTags.forEach(function(remoteClientButtonsTag) {
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
};

    var removeClient = function(clientId) {
        delete remoteClients[clientId];
    };

    $scope.updateLocalName = function() {
        localStorage.setItem('LocalClientName', $scope.localClientName);
        $scope.rtc.setLocalClientName($scope.localClientName);
    };

    $scope.callRemoteClient = function(remoteClient) {
        remoteClient.isInCall = true;
        remoteClient.currentConnection = $scope.rtc.call(remoteClient.id);
    };

    $scope.endCall = function(remoteClient) {
        if (!remoteClient.currentConnection) return;
        remoteClient.currentConnection.close();
        remoteClient.isInCall = false;
    };
    

    $scope.localClientName = localStorage.getItem('LocalClientName');
    $scope.rtc.setLocalClientName($scope.localClientName);

};
