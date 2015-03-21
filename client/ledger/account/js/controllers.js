'use strict';

var g$scope;
var app=angular.module('accountApp', []);
app.controller('AccountCtrl',function($scope) {
	g$scope=$scope;
	$scope.lang=getLang();
	$scope.funds=[];//持有资金
	$scope.issuers=[];//发行资金，一般是网关
	$scope.accountsetting=[];//账号的设置信息
	$scope.offers=[];//市场交易挂单
	$scope.txs=[];//历史交易，简称TX
	$scope.showfills=function(filldiv){
		$(filldiv).slideToggle(1000);
	}
});
////////filter
app.filter('checkmark', function() {
	return function(input) {
  	return input ? '\u2713' : '\u2718';
	}
});

app.filter('shortTX', function() {
	return function(input) {
  	return shortTX(input);
	}
});
app.filter('shortAccount', function() {
	return function(input) {
  	return shortAccount(input);
	}
});
app.filter('toname', function() {
	return function(input) {
  	return account2name(input);
	}
});
app.filter('bracket', function() {
	return function(input) {
		if(input=="") return "";
  	return "("+input+")";
	}
});
