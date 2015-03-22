'use strict';

var g$scope;
var app = angular.module('accountApp');
app.controller('AccountCtrl', function($scope) {
  g$scope = $scope;
  $scope.lang = getLang();
  $scope.setlang=function(l){
    $scope.lang=l;
    saveLang(l);
  }
  $scope.funds = []; //持有资金
  $scope.issuers = []; //发行资金，一般是网关
  $scope.accountsetting = []; //账号的设置信息
  $scope.offers = []; //市场交易挂单
  $scope.txs = []; //历史交易，简称TX
  $scope.showfills = function(filldiv) {
    $(filldiv).slideToggle(1000);
  }
});
