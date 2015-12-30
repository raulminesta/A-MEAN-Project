var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'static/partials/login.html'
    })
    .when('/dashboard', {
        templateUrl: 'static/partials/dashboard.html'

    })
    .when('/video', {
        templateUrl: 'static/partials/video_channel.html'
    })
});