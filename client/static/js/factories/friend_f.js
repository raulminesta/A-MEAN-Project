ballyCyrk.factory('friendFactory', function($http){
  var factory = {};

  factory.request = function(him, her, callback){
    $http.post('/request', {him: him, her: her}).success(function(output){
      callback();
    });
  }

  factory.delete = function(id, callback){
    $http.delete('/request/'+id).success(function(){
      callback();
    });
  }

  factory.pending = function(id, callback){
    $http.post('/pending/'+id).success(function(output){
      callback(output);
    });
  }

  factory.confirmed = function(id, callback){
    $http.post('/confirm/'+id).success(function(output){
      callback(output);
    });
  }

  return factory;
})
