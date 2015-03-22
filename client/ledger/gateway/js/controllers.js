'use strict';

var g$scope;
var app=angular.module('gatewayApp');
app.controller('GatewayCtrl',function($scope) {
	g$scope=$scope;
	$scope.lang=getLang();
	$scope.setlang=function(l){
		$scope.lang=l;
		saveLang(l);
	}
	$scope.gateway=gateway;
	$scope.goods=goods;
	$scope.money=money;
	$scope.buyoffers=[];
	$scope.saleoffers=[];
	$scope.pagesize=25;
	$scope.getmore=function(){
		$scope.pagesize+=20;
		$scope.restsaleofferssize=$scope.saleoffers.length-$scope.pagesize;
		$scope.restbuyofferssize=$scope.buyoffers.length-$scope.pagesize;
    }
	$scope.getall=function(){
		$scope.pagesize=$scope.saleoffers.length;
		if($scope.pagesize<$scope.buyoffers.length) $scope.pagesize=$scope.buyoffers.length
		$scope.restsaleofferssize=$scope.saleoffers.length-$scope.pagesize;
		$scope.restbuyofferssize=$scope.buyoffers.length-$scope.pagesize;
    }
	$scope.getfirstpage=function(){
		$scope.pagesize=20;
		$scope.restsaleofferssize=$scope.saleoffers.length-$scope.pagesize;
		$scope.restbuyofferssize=$scope.buyoffers.length-$scope.pagesize;
    }
	$scope.loglist=[];
	$scope.onOfferlog=false;
	$scope.onoffOfferLog=function(){
		var togglebtn=$("#onoffofferlog");
		togglebtn.find('.btn').toggleClass('active');
		togglebtn.find('.btn').toggleClass('btn-info');
		togglebtn.find('.btn').toggleClass('btn-default');
		//console.log(togglebtn.find('.active').attr("value"));
		$scope.onOfferlog=togglebtn.find('.active').attr("value")=="true";
		//if($scope.onOfferlog) console.log("真");else console.log("假");
	}

});
