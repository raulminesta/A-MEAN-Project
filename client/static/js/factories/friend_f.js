ballyCyrk.factory('friendFactory', function($http){
  var factory = {};

  factory.request = function(him, her, callback){
    $http.post('/request', {him: him, her: her}).success(function(output){
      callback();
    });
  }

  factory.delete = function(id, callbackP, callbackR){
    $http.delete('/request/'+id).success(function(){
      return
    });
  }

  factory.pending = function(id, callback){
    $http.get('/pending/'+id).success(function(output){
      callback(output);
    });
  }

  factory.confirmed = function(id, callback){
    $http.post('/confirm/'+id).success(function(output){
      callback(output);
    });
  }

  factory.requested = function(id, callback){
    $http.get('/requests/'+id).success(function(output){
      callback(output);
    })
  }

  return factory;
})
