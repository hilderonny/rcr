
window.onload = function() {

    var localIdTags = document.querySelectorAll('localId');
    var socketListTags = document.querySelectorAll('socketList');

    var sockets = {};

    var comm = new Comm();

    comm.on('connect', function(socket) {
        localIdTags.forEach(function(localIdTag) {
            localIdTag.innerText = socket.id;
        });
    });

    comm.on('socketConnected', function(socketIds) {
        socketIds.forEach(function(socketId) {
            var socket = { tags: [] };
            sockets[socketId] = socket;
            socketListTags.forEach(function(socketListTag) {
                var tag = document.createElement('div');
                tag.socketId = socketId;
                tag.innerHTML = socketId;
                socketListTag.appendChild(tag);
                socket.tags.push(tag);
            });
        });
    });

    comm.on('socketDisconnected', function(socketId) {
        sockets[socketId].tags.forEach(function(tag) {
            tag.parentNode.removeChild(tag);
        });
        delete sockets[socketId];
    });
    
};
