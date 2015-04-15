'use strict';

angular.module('ledgerApp')
  .filter('checkmark', function() {
    return function(input) {
      return input ? '\u2713' : '\u2718';
    }
  })
  .filter('shortTX', function() {
    return function(input) {
      return shortTX(input);
    }
  })
  .filter('shortAccount', function() {
    return function(input) {
      return shortAccount(input);
    }
  })
  .filter('toname', function() {
    return function(input) {
      return account2name(input);
    }
  })
  .filter('bracket', function() {
    return function(input) {
      if (input == "") return "";
      return "(" + input + ")";
    }
  });
