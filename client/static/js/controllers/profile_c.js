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
    })
  }

  this.logout = function(){
    userFactory.logout(_this.user, function(data){
      if (!data) { $location.path('#/'); };
    });
  }

  this.friendRequest = function(her){
    friendFactory.request(_this.user, her, this.pending);
  }

  this.pending = function(){
    friendFactory.pending($routeParams.id, function(data){
      _this.pendingFriends = data;
      var temp = _this.everyone;
      for (var p = 0; p < _this.pendingFriends.length; p++){
        for (var e =0; e < _this.everyone.length; e++){
          if(_this.pendingFriends[p].her.username._id == temp[e]._id){
            _this.everyone.splice(e,1);
            break
          }
        }
      }
      _this.everyone = temp
    });
  }

  this.confirmed = function(){
    friendFactory.confirmed($routeParams.id, function(data){
      _this.confirmedFriends = data;
    });
  }

  this.deleteRequest = function(her){
    _this.everyone.push(her.her.username);
    friendFactory.delete(her._id, this.pending);
  }

  this.currentUser();
  this.allUsers();
  this.pending();
  this.confirmed();
})
