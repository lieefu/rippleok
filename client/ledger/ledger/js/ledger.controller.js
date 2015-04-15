'use strict';

var g$scope;
var app = angular.module('ledgerApp');
app.controller('LedgerCtrl', function($scope,$http,$location) {
  g$scope = $scope;
  $scope.lang = getLang();
  $scope.setlang=function(l){
    $scope.lang=l;
    saveLang(l);
  }
  $scope.ledgerinfo = "";
  $scope.clickGetTX=function(ledgerid){
    console.log(ledgerid);
    if(!ledgerid||ledgerid==="") return;
    $scope.ledgerid=ledgerid;
    $location.hash(ledgerid);
    getTX(ledgerid);
  }
  var urlhash = $location.hash();
  //console.log("urlhash:",urlhash);
  $scope.clickGetTX(urlhash);

  function  getTX(ledger_identifier){
    $("#dataLoading").show();
    $('.tab-pane').hide();
    //https://history.ripple.com/v1/ledgers/3170DA37CE2B7F045F889594CBC323D88686D2E90E8FFD2BBCD9BAD12E416DB5?transactions=true&binary=false&expand=true
    $http.get("https://history.ripple.com/v1/ledgers/"+ledger_identifier+"?transactions=true&binary=false&expand=true")
    .success(function(res){
      if(res.result&&res.result==="success"){
        $scope.ledgerinfo = JSON.stringify(res.ledger,null,4);
        Process(res.ledger);
      }else{
        $scope.ledgerinfo=res;
        Process(res);
      }
      CollapseLevel(4);
      $("#dataLoading").hide();
      $('#jsonview').show();
    })
    .error(function(err){
      $scope.ledgerinfo = err;
      console.log("error:",err);
      Process($scope.ledgerinfo);
      CollapseLevel(4);
      $("#dataLoading").hide();
      $('#jsonview').show();
    })
  }
});
