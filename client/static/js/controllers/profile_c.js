
ballyCyrk.controller('profileController', function(userFactory, friendFactory, $routeParams, $location, $rootScope, $window){
  var _this = this;

   var currentUser;


  this.currentUser = function(){
    userFactory.show($routeParams.id, function(data){
      _this.user = data;
      console.log("YOU: ", data);
      socket.emit("login", {id: data._id,
                            username: data.username});

      userFactory.confirmLogin(_this.user, function(data){
        console.log("PC>DATA", data)
        if (!data) { $location.path('#/'); }
      });
    });
  }
  socket.on("users-online", function(data) {
    this.confirmed();
  });

  this.allUsers = function(){
    userFactory.index($routeParams.id, function(data){
      _this.everyone = data;
      console.log("EVERYONE:",_this.everyone);
    });
    userFactory.socket.on("users-online", function(data) {
      // rootscope allows for auto update when data callback updates
      $rootScope.$apply(function() {
        _this.users_online = data;
      });

      for (var i = 0; i < data.length; i++) {
        if (data[i].id == _this.user._id) {
          currentUser = data[i];
        }
      }
    });

  }

  this.logout = function() {
    userFactory.socket.emit("logout", {user: _this.user});
    userFactory.logout(_this.user, function(data){
      if (!data) { $location.path('#/'); };
    });
  }

  this.pending = function(){
    friendFactory.pending($routeParams.id, function(data){
      _this.pendingFriends = data;
      console.log("PENDING", data);
      var temp = _this.everyone;
      for (var p = 0; p < _this.pendingFriends.length; p++){
        for (var e =0; e < _this.everyone.length; e++){
          if(_this.pendingFriends[p]._id == temp[e]._id){
            _this.everyone.splice(e,1);
            break
          }
        }
      }
    });
  }

  this.confirmed = function(){
    friendFactory.confirmed($routeParams.id, function(data){
      _this.friends = data;
      console.log("FRIENDS: ", data);
      if (_this.requestedFriendship) {
        console.log("FRIENDS: ", _this.requestedFriendship.length);
        var temp = _this.requestedFriendship;
        for (var p = 0; p < _this.friends.length; p++){
          for (var e =0; e < _this.requestedFriendship.length; e++){
            if(_this.friends[p]._id == temp[e]._id){
              _this.requestedFriendship.splice(e,1);
              break
            }
          }
        }
      }
      temp = _this.everyone;
      for (var p = 0; p < _this.friends.length; p++){
        for (var e =0; e < _this.everyone.length; e++){
          if(_this.friends[p]._id == temp[e]._id){
            _this.everyone.splice(e,1);
            break
          }
        }
      }
    });
  }

  this.requested = function(){
    friendFactory.requested($routeParams.id, function(data){
      _this.requestedFriendship = data;
      console.log("REQUESTED", data);
      var temp = _this.everyone;
      for (var r = 0; r < _this.requestedFriendship.length; r++) {
        for (var e = 0; e < _this.everyone.length; e++) {
          if (_this.requestedFriendship[r]._id == temp[e]._id) {
            _this.everyone.splice(e,1);
            break
          }
        }
      }
    })
  }

  this.acceptRequest = function(her){
    friendFactory.accept(_this.user, her, this.confirmed);
  }

  this.deleteRequest = function(her){
    friendFactory.delete(_this.user, her);
    for (var i = 0; i < _this.pendingFriends.length; i++) {
      if (her._id == _this.pendingFriends[i]._id) {
        _this.pendingFriends.splice(i,1);
        _this.everyone.push(her);
        break;
      }
    }
    for (var i = 0; i < _this.requestedFriendship.length; i++) {
      if (her._id == _this.requestedFriendship[i]._id) {
        _this.requestedFriendship.splice(i,1);
        _this.everyone.push(her);
        break;
      }
    }
  }

  this.friendRequest = function(her){
    friendFactory.request(_this.user, her, this.pending);
  }

  this.requestCall = function(otherUser){
    userFactory.socket.emit("requestCall", {"receptionSocket": otherUser.socket,
                                    "donorSocket": currentUser.socket,
                                    "donorName": currentUser.username
                                });
  }

  userFactory.socket.on("requestingCall", function(data) {
    console.log(data);
    $rootScope.$apply(function() {
      notie.confirm(data.donorName + " wants to video call", "Accept", "Decline",function() {
        console.log("Call accepted");
        var chatroomID = data.donorSocket + currentUser.socket;
        chatroomID = chatroomID.replace(/#/g, '1');
        console.log(chatroomID);
        userFactory.socket.emit("callAccepted", {"donorSocket": data.donorSocket,
                                     "chatroomID": chatroomID
                                    });
        $rootScope.$apply(function() {
          $location.path('/videoChat' + chatroomID);
        });

      }, function() {
        console.log("Call declined");
        userFactory.socket.emit("callDeclined", {"donorSocket": data.donorSocket});
      });
    });
  });

  userFactory.socket.on("callAccepted", function(data) {
    console.log("Donor received answer");
    $rootScope.$apply(function() {
      $location.path('/videoChat' + data.chatroomID);
    });
  });

  userFactory.socket.on("callDeclined", function() {
    $rootScope.$apply(function() {
      console.log("callDeclined socket works");
      notie.alert(3, "User declined your request", 2.5);
    })
  })

  this.currentUser();
  this.allUsers();
  this.pending();
  this.requested();
  this.confirmed();
})
