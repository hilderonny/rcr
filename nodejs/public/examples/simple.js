window.addEventListener('load', function() {
    var socket = io();
    
    var input = document.getElementById('input');
    var button = document.getElementById('button');
    var output = document.getElementById('output');

    // Send chat message to other clients when clicking on the button
    function sendMessage() {
        var message = {
            type: 'chat',
            content: input.value
        };
        socket.emit('msg', message);
        input.value = '';
        input.focus();
    }

    // Event listener on button and on input enter
    button.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function(e) {
        if ((e.which || e.keyCode) === 13) sendMessage();
    });

    // Handle incoming chat messages
    socket.on('msg', function(message) {
        if (message.type === 'chat') {
            output.innerHTML += '<p>' + message.content + '</p>';
        }
    });

});
