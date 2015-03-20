'use strict';

// Declare app level module which depends on views, and components
angular.module('gatewayApp', [
  'ngRoute',
  'gatewayApp.view1',
  'gatewayApp.view2',
  'gatewayApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
