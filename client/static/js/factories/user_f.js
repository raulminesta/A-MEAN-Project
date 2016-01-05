ballyCyrk.factory('userFactory', function($http){
  var usersLoggedIn = [];
  var factory = {};

  factory.create = function(user, callback){
    console.log('Factory!', user);
    $http.post('/signup', user).success(function(output){
      callback(output);
    })
  }

  factory.index = function(callback){
    $http.get('/users').success(function(output){
      callback(output);
    })
  }

  factory.loginUser = function(user, callback){
    $http.post('/login', user).success(function(output){
      callback(output);
    })
  }

  factory.facebook = function(callback){
    $http.get('/auth/facebook').success(function(output){
      callback(output);
    })
  }

  factory.google = function(callback){
      $http.get('/auth/google').success(function(output){
      callback(output);
    })
  }

  factory.show = function(id, callback){
    $http.get('/user/'+id).success(function(output){
      callback(output);
    })
  }

  factory.loggedin = function(user, callback){
    var i = 0
    while (i < usersLoggedIn.length){
      if (user._id == usersLoggedIn[i]._id){
        var present = true;
        break;
      } else {
        i++
        console.log('i = ', i);
      };
    }
    if (!present){
      usersLoggedIn.push(user);
    };
    console.log('loggedin', usersLoggedIn);
    callback(user);
  }

  factory.confirmLogin = function(user, callback){
    var i = 0
    while (i < usersLoggedIn.length){
      if (user._id == usersLoggedIn[i]._id){
        var present = true;
        break;
      } else {
        i++
        console.log('i = ', i);
      };
    }
    if (present){
      callback(true);
    } else {
      callback(false);
    }
  }

  factory.logout = function(user, callback){
    for (var i =0; i < usersLoggedIn.length; i++){
      if (user._id == usersLoggedIn[i]._id){
        usersLoggedIn.splice(i,1);
        $http.get('/logout').success(function(data){
          console.log('logoutrip', data);
        });
        callback(false);
        break;
      } else {
      callback(true);
      }
    }
  }

  return factory;
})
