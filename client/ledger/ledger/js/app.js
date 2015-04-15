'use strict';

angular.module('ledgerApp', [])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);
