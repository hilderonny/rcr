angular.module('sourcelist', []).controller('SourceListController', function($scope) {

    $scope.client = new Client();

    $scope.iconMap = {
        audioinput: 'icons8-Microphone-48.png',
        audiooutput: 'icons8-Speaker-48.png',
        videoinput: 'icons8-Webcam-48.png',
        videooutput: 'icons8-Monitor-48.png'
    }

    $scope.client.on('deviceList', function(deviceList) {
        $scope.$apply();
    });

    $scope.selectedDevice = { device: null };

    $scope.connectToDevice = function(device) {
        $scope.client.connectToDevice(device);
    };
    
});