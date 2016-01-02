myApp.controller('WebcamController', function() {
    var _WC = this;

    // Detect if user has navigator.getUserMedia
    function hasGetUserMedia() {
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    if (hasGetUserMedia()) {
      // Good to go!
    } else {
      alert('getUserMedia() is not supported in your browser');
    }


    navigator.getUserMedia  = navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia;

    var constraints = {
      video: true,
      audio: false
    }

    var localStream;

    var video = document.querySelector('video');

    function successCallback(stream) {
      window.stream = stream;
      if(window.URL) {
        video.src = window.URL.createObjectURL(stream);
      } else {
        video.src = stream;
      }
      localStream = stream;
    }

    var errorCallback = function(e) {
        console.log('Reeeejected!', e);
    }

    this.webcam = function (constraints) {
      if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, successCallback, errorCallback);
      } else {
        video.src = 'somevideo.webm'; // fallback.
      }
    }

    this.videoOn = function () {
      constraints.video = true;
      this.webcam(constraints);
    }

    this.videoOff = function () {
      localStream.getVideoTracks()[0].stop();
      // constraints.video = false;
      // this.webcam(constraints);
    }
    
});