var sockets = {};
var rtc = null;

var addStream = function(socketId, stream) {
    var socket = sockets[socketId];
    socket.streams[stream.id] = stream;
    var videoTag = document.createElement('video');
    stream.videoTag = videoTag;
    videoTag.setAttribute('autoplay', 'autoplay');
    document.getElementById('remoteVideos').appendChild(videoTag);
    videoTag.src = window.URL.createObjectURL(stream);
};

var removeStream = function(socketId, streamId) {
    var socket = sockets[socketId];
    var stream = socket.streams[streamId];
    var videoTag = stream.videoTag;
    videoTag.pause();
    videoTag.src = '';
    videoTag.parentNode.removeChild(videoTag);
    delete socket.streams[streamId];
};

window.onload = function() {
    /*
    rtc = new WebRTC({ audio: true, video: true}, true);
    
    rtc.on('connect', function(socket) {
        document.getElementById('localId').innerText = socket.id;
    });

    rtc.on('socketConnected', function(socketIds) {
        socketIds.forEach(function(socketId) {
            var button = document.createElement('button');
            button.socketId = socketId;
            button.innerHTML = socketId;
            button.onclick = function() {
                rtc.call(button.socketId);
            };
            document.getElementById('socketList').appendChild(button);
            sockets[socketId] = {
                button: button,
                streams: {}
            };
        });
    });

    rtc.on('socketDisconnected', function(socketId) {
        var socket = sockets[socketId];
        socket.button.parentNode.removeChild(socket.button);
        Object.keys(socket.streams).forEach(function(streamId) {
            removeStream(socketId, streamId);
        });
        delete sockets[socketId];
    });

    rtc.on('localStream', function(localStream) {
        document.getElementById('localVideo').src = window.URL.createObjectURL(localStream);
    });

    rtc.on('remoteStream', function(event) {
        addStream(event.connection.remoteSocketId, event.stream);
    });
    */

    var comm = new Comm();

    comm.on('socketConnected', function(socketIds) {
        socketIds.forEach(function(socketId) {
            var button = document.createElement('button');
            button.socketId = socketId;
            button.innerHTML = socketId;
            button.onclick = function() {
                rtc.call(button.socketId);
            };
            document.getElementById('socketList').appendChild(button);
            sockets[socketId] = {
                button: button,
                streams: {}
            };
        });
    });
    
};
