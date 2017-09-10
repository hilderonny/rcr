window.addEventListener('load', function() {
    var rtc = new WebRTC({ audio: true, video: true}, true);

    rtc.on('localStream', function(localStream) {
        document.getElementById('video').srcObject = localStream;
    });

    rtc.setLocalClientName('J.A.R.V.I.S.');
});