window.addEventListener('load', function() {
    // @ts-ignore
    var socket = io();
    socket.emit('msg', { type: 'Typ halt' });
});
