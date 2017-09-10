window.addEventListener('load', function($scope, $mdMedia) {
    
    var rtc = new WebRTC({ audio: true, video: true}, false);

    var jarvis = null;
    var currentConnection = null;

    rtc.on('clientList', function(newClientList) {
        Object.keys(newClientList).forEach(function(k) {
            var client = newClientList[k];
            if (client.name !== 'J.A.R.V.I.S.') return;
            jarvis = client;
        });
    }).on('localStream', function() {
        if (currentConnection) currentConnection.close();
            currentConnection = rtc.call(jarvis.id);
    }).on('remoteStream', function(event) {
        document.getElementById('video').srcObject = event.stream;
    });

});
    