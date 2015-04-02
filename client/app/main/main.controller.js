'use strict';
var option;
var echarts;
var myChart;
var g$scope;
var g$http;
var Kgateway={
  currency:'USD',
  name:'snapswap',
  address:'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
}
var rippledataurl1='https://api.ripplecharts.com/api/offers_exercised';
var rippledataurl2='http://192.168.0.100:5993/api/offers_exercised';
angular.module('rippleokApp')
.controller('MainCtrl', function ($scope, $http) {
  g$scope=$scope;
  g$http = $http;
  $scope.showKchart=true;
  $scope.startTime=moment({ minute: 0, second: 0}).subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
  $scope.endTime=moment().format('YYYY-MM-DD HH:mm:ss');
  $scope.lang=getLang();
  $scope.markets=Markets;
  $scope.ExchgRate=ExchgRate;
  $scope.setlang=function(l){
    $scope.lang=l;
    saveLang(l);
  }
  $scope.showK=function(kgw){
    //console.log(kgw);
    Kgateway.currency = kgw.currency;
    Kgateway.name = kgw.name;
    Kgateway.address = kgw.address;
    showXRPkChart();
  }
  //console.log("main controller start,echarts is",echarts);
  //防止ui_router切换回本视图时重新刷新K线图
  if(echarts){
    myChart=echarts.init(document.getElementById('kchart'));
    myChart.setOption(option);
    return;
  }
  initprice();

  // /////////////////////////////////

  require.config({
    paths: {
      //echarts: 'bower_components/echarts/build/dist/'
      //echarts: 'http://echarts.baidu.com/build/dist'
      echarts:'https://cdnjs.cloudflare.com/ajax/libs/echarts/2.2.1/'
    }
  });
  // 使用
  require(
    [
      'echarts',
      'echarts/chart/k',
      'echarts/chart/line',
      'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
    ],
    function (ec) {
      // 基于准备好的dom，初始化echarts图表
      //console.log(ec);
      echarts=ec;
      //console.log("main controller start,myChart is",myChart);
      myChart = ec.init(document.getElementById('kchart'));
      showXRPkChart();
      loadMarketsHistoryPrice();
    }
  );
  // /////////////////////////////////////
});
function loadGatewayHistoryPrice(gateway,callback){
  var reqdata={
    base : {currency: "XRP"},
    counter : {currency: "CNY", issuer: "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA"},
    startTime :null,
    endTime   :null,
    timeIncrement : "hour",
    timeMultiple : 1,
    format : "json"
  }
  //console.log("loadGatewayHistoryPrice",gateway);
  //reqdata.startTime = moment({hour: 0, minute: 0});//moment().subtract(1, 'days').utc().format();
  reqdata.startTime = moment({ minute: 0, second: 0}).subtract(1, 'days').utc().format();
  reqdata.endTime = moment().utc().format();
  reqdata.counter.currency=gateway.iou;
  reqdata.counter.issuer=gateway.address;
  loadRippleData(reqdata,function(err,res){
    if(err){
      console.log("error:",err,res);
      callback(err);
      return;
    }
    //console.log("gateway 24 hour price",res);
    var results=res.results;
    //var today = moment({hour: 0, minute: 0});
    gateway.volume.xrp=gateway.volume.iou=0;
    gateway.price.low="";
    gateway.price.high=0;
    for (var i = 0; i < results.length; i++) {
      var kdate=moment(results[i].startTime);
      //console.log(kdate);
      //if(kdate>=today){
      //console.log("today:",kdate.format());
      var price=(''+results[i].vwap).substring(0,9)
      gateway.price.value=price;
      //console.log("today:",kdate.format(),"price",price,gateway.price.low,gateway.price.low>price);
      if(price<(gateway.price.low||999999)) gateway.price.low=price;
      if(price>gateway.price.high) gateway.price.high=price;
      gateway.volume.xrp+=results[i].baseVolume;
      gateway.volume.iou+=results[i].counterVolume;
      //}else{
      //  console.log("kdate",kdate);
      //}
    }
    callback();
  });

}
function loadMarketsHistoryPrice(){
  async.eachSeries(Markets,
    function(market,callback){
      async.eachSeries(market.gateways,
        loadGatewayHistoryPrice,
        function(err){
          callback(err);
          if(err) console.log(err);
        }
      );
    },
    function(err){
      startGetPrice();
      if(err) console.log(err);
    }
  );
}

function loadRippleData(reqdata,callback){
  g$http.post(rippledataurl1,reqdata).success(function(res){
    //console.log("success:",res);
    callback(null,res);
  }).error(function(err){
    console.log("error:",err);//net::ERR_CONNECTION_REFUSED 异常发生时，err is null
    if(_.isNull(err)){err="exception";}
    callback(err);
  });
}
function showXRPkChart(){
  myChart.showLoading({text: '数据加载中(Loading data)...'});
  var reqdata={
    base : {currency: "XRP"},
    counter : {currency: "CNY", issuer: "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA"},
    startTime :null,
    endTime   :null,
    timeIncrement : "hour",
    timeMultiple : 1,
    format : "json"
  }
  reqdata.startTime = moment().subtract(7, 'days').utc().format();
  reqdata.endTime = moment().utc().format();
  reqdata.counter.currency=Kgateway.currency;
  reqdata.counter.issuer=Kgateway.address;
  //console.log(reqdata);
  loadRippleData(reqdata,function(err,res){
    if(err) {
      g$scope.showKchart=false;
      myChart.hideLoading();
      console.log('数据加载失败，Load data failed：'+err);
      return;
    }
    //console.log(res);
    myChart.clear();
    option.title.text=reqdata.base.currency+'/'+reqdata.counter.currency+'.' +Kgateway.name + (getLang()==0?' candlestick':' K线图');
    option.title.subtext='                '+moment(res.startTime).format("YYYY-MM-DD HH:mm")+'---'+moment(res.endTime).format("YYYY-MM-DD HH:mm");
    option.xAxis[0].data=[];
    option.series[0].data=[];
    option.series[1].data=[];
    var results=res.results;
    //console.log(results);
    for (var i = 0; i < results.length; i++) {
      var kdate=moment(results[i].startTime);
      // //console.log(kdate);
      // if(kdate>=moment({hour: 0, minute: 0})){
      //   console.log("today:",kdate.format());
      //   var price=(''+results[i].vwap).substring(0,9)
      //   maingateway.ref.price.value=price;
      //   console.log("today:",kdate.format(),"price",price,maingateway.ref.price.low,maingateway.ref.price.low>price);
      //   if(price<(maingateway.ref.price.low||999999)) maingateway.ref.price.low=price;
      //   if(price>maingateway.ref.price.high) maingateway.ref.price.high=price;
      //   maingateway.ref.volume.xrp+=results[i].baseVolume;
      //   maingateway.ref.volume.iou+=results[i].counterVolume;
      // }
      option.xAxis[0].data.push(kdate.format("MM-DD HH:mm"));
      //option.series[0].data.push(results[i].baseVolume<1000||results[i].baseVolume>100000?'-':results[i].baseVolume);
      option.series[0].data.push(Math.round(results[i].baseVolume));
      option.series[1].data.push([results[i].open.toFixed(5) ,results[i].close.toFixed(5),results[i].low.toFixed(5),results[i].high.toFixed(5)]);
      //console.log(results[i].open.toFixed(5));
    }
    //	console.log(option.xAxis[0].data);
    //console.log(option.series[1].data);
    myChart.setOption(option);
    myChart.hideLoading();
  });
}

function initprice(){
  var tradedata={};
  if(window.localStorage){
    if(localStorage.tradedata){
      tradedata=JSON.parse(localStorage.tradedata);
    }
  }
  for(var i=0;i<Markets.length;i++){
    for(var j=0;j<Markets[i].gateways.length;j++){
      var gateway=Markets[i].gateways[j];
      var trade=tradedata[Markets[i].currency+gateway.address];
      gateway.price.action='gray';
      gateway.price.value=trade?trade.price:0;
      gateway.url=Gateways[gateway.address].weburl;
    }
  }
}


// 为echarts对象加载数据
option = {
  title : {
    show:true,
    text: '2015年XRP价格走势图',
    subtext: '                RippleChina'
  },
  tooltip : {
    trigger: 'axis',
    formatter: function (params) {
      var res = params[0].name;
      for (var i = params.length - 1; i >= 0; i--) {
        if (params[i].value instanceof Array) {
          res += '<br/>' + params[i].seriesName;
          res += '<br/>  开盘(open) : ' + params[i].value[0] + ' 最低(low) : ' + params[i].value[2];
          res += '<br/>  收盘(close): ' + params[i].value[1] + ' 最高(high): ' + params[i].value[3];
        }
        else {
          res += '<br/>交易量(volume): ' + comma(params[i].value) + params[i].seriesName;
        }
      }
      return res;
    }
  },
  legend: {
    show:false,
    data:['上证指数','成交金额(万)']
  },
  toolbox: {
    show : true,
    feature : {
      mark : {show: true},
      dataZoom : {show: true},
      dataView : {show: false, readOnly: false},
      magicType: {show: true, type: ['line', 'bar']},
      restore : {show: true},
      saveAsImage : {show: true},
      fresh : {
        show : true,
        title : getLang()==0?'Reload data':'刷新数据',
        icon : 'assets/img/refresh.ico',
        onclick : function (){
          //alert('myToolHandler')
          showXRPkChart();
        }
      }
    }
  },
  dataZoom : {
    show : true,
    realtime: true,
    //y:36,
    //height:15,
    start : 30,
    end : 100
  },
  grid:{x:50,y:25,x2:50,y2:60},
  xAxis : [
    {
      type : 'category',
      boundaryGap : true,
      axisTick: {onGap:true},
      splitLine: {show:true},
      data : []
    }
  ],
  yAxis : [
    {
      type : 'value',
      scale:true,
      splitNumber: 10,
      boundaryGap: [0, 0]
    },
    {
      type : 'value',
      scale:true,
      splitNumber: 10,
      boundaryGap: [0, 0],
      axisLabel: {
        formatter: function (v) {
          return Math.round(v/1000)+'K'
        }
      }
    }
  ],
  series : [
    {
      name:'XRP',
      type:'bar',
      //barWidth:5,
      itemStyle:{
        normal:{
          color: '#4393B9'
        }
      },

      yAxisIndex: 1,
      symbol: 'none',
      data:[]
    },
    {
      name:'XRP价格',
      type:'k',
      itemStyle: {
        normal: {
          color: 'lightgreen',           // 阳线填充颜色
          color0: 'white',   // 阴线填充颜色
          lineStyle: {
            width: 1,
            color: 'green',    // 阳线边框颜色
            color0: 'red'     // 阴线边框颜色
          }
        },
        emphasis: {
          color: 'black',         // 阳线填充颜色
          color0: 'white'         // 阴线填充颜色
        }
      },
      data:[]
    }
  ]
};
