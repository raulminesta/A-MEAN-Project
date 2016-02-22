ballyCyrk.controller('VideoChatController', function (userFactory, $cookies, $location) {
    _VCC = this;
    _VCC.audioValue = 'Mute';
    _VCC.videoValue = 'Pause';

    this.back = function() {
        // $location.path('/profile/' + $cookies.currentUser.user._id);
        console.log($cookies.currentUser);
    }

    this.logout = function(){
      if (!_this.user){
        $location.path('#/')
      } else {
      userFactory.logout(_this.user, function(data){
          console.log(data);
          if (!data) { $location.path('#/'); };
        });
      }
    }

    var video_out = document.getElementById('vid-box');
    var video_thumb = document.getElementById('vid-thumb');

    this.login = function () {
        // publish_key and subscribe_key, create a pubnub account and 
        // get the information from there
        var phone = window.phone = PHONE({
            number : _VCC.currentUser.username || 'Anonymous',
            publish_key : 'publish_key',
            subscribe_key: 'subscribe_key',
            ssl: true
        });

        var ctrl = window.ctrl = CONTROLLER(phone);

        // called when ready to receive call
        ctrl.ready(function () {
            console.log('phone is ready');
            ctrl.addLocalStream(video_thumb);
        });

        ctrl.receive(function (session) {
            // new call
            console.log('receiving');
            session.connected(function (session) { video_out.appendChild(session.video); });

            // call ended
            session.ended(function (session) { ctrl.getVideoElement(session.number).remove(); });
        });
    }

    this.makeCall = function () {
        // User must login in first to make a call
        if (!window.phone) { 
            alert('login first!'); 
        } else  {
            phone.dial(_VCC.number);
            // ctrl.isOnline(_VCC.number, function (isOn) {
            //     if (isOn) { ctrl.dial(_VCC.number); }
            //     else { alert('User is Offline'); }
            // });
        }
    }

    // End call
    this.end = function () {
        ctrl.hangup();
    }

    // Toggle audio on or off
    // Change button name to Unmute if there is no audio
    // Change button name to Mute if there is audio
    this.mute = function () {
        var audio = ctrl.toggleAudio();
        if (!audio) {
            _VCC.audioValue = 'Unmute';
        } else {
            _VCC.audioValue = 'Mute';
        }
    }

    this.pause = function () {
        var video = ctrl.toggleVideo();
        if (!video) {
            _VCC.videoValue = 'Unpause';
        } else {
            _VCC.videoValue = 'Pause';
        }
    }   

});