myApp.controller('WebcamController', function() {
    var _WC = this;

    function hasGetUserMedia() {
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    if (hasGetUserMedia()) {
      // Good to go!
      alert('good to go!');
    } else {
      alert('getUserMedia() is not supported in your browser');
    }

    var errorCallback = function(e) {
        console.log('Reeeejected!', e);
      };

    navigator.getUserMedia  = navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia;

    var video = document.querySelector('video');

    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true, audio: false}, function(stream) {
        video.src = window.URL.createObjectURL(stream);
      }, errorCallback);
    } else {
      video.src = 'somevideo.webm'; // fallback.
    }
    
});