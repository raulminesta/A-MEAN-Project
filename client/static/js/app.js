ballyCyrk = angular.module('ballyCyrk', ['ngRoute', 'ngMessages']);

// ------PARTIAL ROUTES------
ballyCyrk.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: './../static/views/partials/_home.html',
    controller: 'homeController as HC'
  })
  .when('/login', {
    templateUrl: './../static/views/partials/_login.html',
    controller: 'loginController as LC'
  })
  .when('/signup', {
    templateUrl: './../static/views/partials/_signup.html',
    controller: 'signupController as SC'
  })
  .when('/profile/:id', {
    templateUrl: './../static/views/partials/_profile.html',
    controller: 'profileController as PC'
  })
  .otherwise({ redirectTo: '/'});
});

