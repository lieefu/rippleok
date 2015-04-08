'use strict';

angular.module('transactionApp', [])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);
