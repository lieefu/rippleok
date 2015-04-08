'use strict';

var g$scope;
var app = angular.module('transactionApp');
app.controller('TransactionCtrl', function($scope,$http,$location) {
  g$scope = $scope;
  $scope.lang = getLang();
  $scope.setlang=function(l){
    $scope.lang=l;
    saveLang(l);
  }
  $scope.transactioninfo = "";
  $scope.clickGetTX=function(txid){
    console.log(txid);
    if(!txid||txid==="") return;
    $scope.TXid=txid;
    $location.hash(txid);
    getTX(txid);
  }
  var urlhash = $location.hash();
  //console.log("urlhash:",urlhash);
  $scope.clickGetTX(urlhash);

  function  getTX(txhash){
    $("#dataLoading").show();
    $('.tab-pane').hide();
    $http.get("https://history.ripple.com/v1/transactions/"+txhash)
    .success(function(res){
      if(res.result&&res.result==="success"){
        $scope.transactioninfo = JSON.stringify(res.transaction,null,4);
        Process(res.transaction);
      }else{
        $scope.transactioninfo=res;
        Process(res);
      }
      CollapseLevel(5);
      $("#dataLoading").hide();
      $('#jsonview').show();
    })
    .error(function(err){
      $scope.transactioninfo = err;
      console.log("error:",err);
      Process($scope.transactioninfo);
      CollapseLevel(5);
      $("#dataLoading").hide();
      $('#jsonview').show();
    })
  }
});
