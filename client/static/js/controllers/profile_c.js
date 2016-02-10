ballyCyrk.controller('profileController', function(userFactory, friendFactory, $routeParams, $location){
  var _this = this;

  this.currentUser = function(){
    userFactory.show($routeParams.id, function(data){
      _this.user = data;
      userFactory.confirmLogin(_this.user, function(data){
        if (!data) { $location.path('#/'); }
      });
    });
  }

  this.allUsers = function(){
    userFactory.index(function(data){
      _this.everyone = data;
      console.log("EVERYONE:",_this.everyone);
    })
  }

  this.logout = function(){
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
          if(_this.pendingFriends[p].her.username._id == temp[e]._id){
            _this.everyone.splice(e,1);
            break
          }
        }
      }
    });
  }

  this.confirmed = function(){
    friendFactory.confirmed($routeParams.id, function(data){
      _this.confirmedFriends = data;
    });
  }

  this.requested = function(){
    friendFactory.requested($routeParams.id, function(data){
      _this.requestedFriendship = data;
      console.log("REQUESTED", data);
      var temp = _this.everyone;
      for (var r = 0; r < _this.requestedFriendship.length; r++) {
        for (var e = 0; e < _this.everyone.length; e++) {
          if (_this.requestedFriendship[r].his.username._id == temp[e]._id) {
            _this.everyone.splice(e,1);
            break
          }
        }
      }
    })
  }

  this.acceptRequest = function(him){
    console.log('from', him);
  }

  this.deleteRequest = function(her){
    _this.everyone.push(her.her.username);
    friendFactory.delete(her._id);
    console.log("REMOVE:", her._id)
    for (var i = 0; i < _this.pendingFriends.length; i++) {
      if (her._id == _this.pendingFriends[i]._id) {
        _this.pendingFriends.splice(i,1);
        console.log("DO IT");
        break;
      }
    }
  }

  this.friendRequest = function(her){
    console.log("You:", _this.user);
    console.log("them:", her);
    friendFactory.request(_this.user, her, this.pending);
  }


  this.currentUser();
  this.allUsers();
  this.pending();
  this.confirmed();
  this.requested();
})
