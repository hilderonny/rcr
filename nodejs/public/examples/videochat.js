window.onload = function() {

    var rtc = new WebRTC({ audio: true, video: true}, true);

    var localIdTags = document.querySelectorAll('localId');
    var remoteClientButtonsTags = document.querySelectorAll('remoteClientButtons');
    var localVideosTags = document.querySelectorAll('localVideos');
    var remoteVideosTags = document.querySelectorAll('remoteVideos');

    var localVideoStreamUrl;

    var remoteClients = {};

    rtc.on('clientList', function(newClientList) {
        Object.keys(remoteClients).forEach((key) => {
            delete remoteClients[key];
        });
        Object.keys(newClientList).forEach(function(clientId) {
            var client = newClientList[clientId];
            addClient(client);
        });
    }).on('socketConnected', function(socketIds) {
        addClient(socketIds);
    }).on('socketDisconnected', function(socketId) {
        removeClient(socketId);
    }).on('clientChanged', function(changedClient) {
        var client = remoteClients[changedClient.id];
        if (!client) return;
        client.name = changedClient.name;
    }).on('localStream', function(localStream) {
        localVideoStreamUrl = window.URL.createObjectURL(localStream);
        localVideosTags.forEach(function(localVideoTag) {
            localVideoTag.src = localVideoStreamUrl;
        });
    }).on('remoteStream', function(event) {
        var client = remoteClients[event.connection.remoteClientId];
        if (!client) return;
        client.remoteVideo = window.URL.createObjectURL(event.stream);
    }).on('clientThumbnail', function(changedClient) {
        var client = remoteClients[changedClient.id];
        if (!client) return;
        client.thumbnail = changedClient.thumbnail;
    }).on('incomingCallAccepted', function(connection) {
        var remoteClient = remoteClients[connection.remoteClientId];
        if (!remoteClient) return;
        remoteClient.isInCall = true;
        remoteClient.currentConnection = connection;
    }).on('connectionClosed', function(connection) {
        var remoteClient = remoteClients[connection.remoteClientId];
        if (!remoteClient) return;
        remoteClient.isInCall = false;
    });

    var addClient = function(socketIds) {
        remoteClients[client.id] = client;
        remoteClientButtonsTags.forEach(function(remoteClientButtonsTag) {
            var button = document.createElement('button');
            button.socketId = socketId;
            button.innerHTML = socketId;
            button.addEventListener('click', function() {
                remoteClient.isInCall = true;
                remoteClient.currentConnection = $scope.rtc.call(remoteClient.id);
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

    updateLocalName = function() {
        localStorage.setItem('LocalClientName', localClientName);
        rtc.setLocalClientName(localClientName);
    };

    callRemoteClient = function(remoteClient) {
        remoteClient.isInCall = true;
        remoteClient.currentConnection = rtc.call(remoteClient.id);
    };

    endCall = function(remoteClient) {
        if (!remoteClient.currentConnection) return;
        remoteClient.currentConnection.close();
        remoteClient.isInCall = false;
    };
    

    localClientName = localStorage.getItem('LocalClientName');
    rtc.setLocalClientName(localClientName);

};
