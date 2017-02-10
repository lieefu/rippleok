'use strict';
var Remote = ripple.Remote;
var Servers ={
  trace: false,
  trusted:        true,
  local_signing:  true,
  local_fee:      true,
  fee_cushion:     1.5,
  servers:[{host: 's1.ripple.com',port: 443,secure: true},{host:'s2.ripple.com',port: 443,secure: true}]
};
var remote = new Remote(Servers);
function startGetPrice(){
	console.log("Begin get ripple price");
	remote.connect(function(err,res) {
		console.log("Connected to:",remote.getServer()._url);
		//console.log("err:",err,"res:",res);
		subscribe();
	});
}

//http://api.k780.com:88/?app=finance.rate&scur=USD&tcur=CNY&appkey=12416&sign=79a36d1d8c108269e7e354cc5e8a89fe&format=json
//{"success":"1","result":{"status":"ALREADY","scur":"USD","tcur":"CNY","ratenm":"美元/人民币","rate":"6.2262","update":"2014-12-19 13:01:20"}}
export var ExchgRate={//对美元汇率
	USD:1,
	CNY:6.8815,
	JPY:112.33,
	EUR:0.9364,
	CAD:1.3177,
	KRW:1144.17,
	SGD:1.4178
}
export var RangeTime={
  startTime:moment().format('YYYY-MM-DD HH:mm:ss'),
  endTime:moment().format('YYYY-MM-DD HH:mm:ss')
}
export var ChangeDetector={ref:null};
export  var Markets =
[
	{
		name: 'US Dollars',
		currency: 'USD',
		symbol:'$',
		gateways:
		[
			{name: 'bitstamp',iou:'USD', address: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''},
      {name: 'snapswap',iou:'USD', address: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
		]
	},

	{
		name: 'ChineseYuan',
		currency: 'CNY',
		symbol:'¥',
		gateways:
		[
			{name: 'ripplefox',iou:'CNY', address: 'rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''},
      {name: 'ripplechina',iou:'CNY', address: 'razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
      /*,
			{name: 'ripplecn',iou:'CNY', address: 'rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
      */
		]
	},
	{
		name: 'Euro',
		currency: 'EUR',
		symbol:'€',
		gateways:
		[
      /*{name: 'bitstamp',iou:'EUR', address: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''},*/
			{name: 'SnapSwap',iou:'EUR', address: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''},
			{name: 'therock',iou:'EUR', address: 'rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
		]
	},
	{
		name: 'JapanYen',
		currency: 'JPY',
		symbol:'¥',
		gateways:
		[
      //{name: 'bitstamp',iou:'JPY', address: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''},
			//{name: 'TradeJapan',iou:'JPY', address: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''},
			{name: 'tokyojpy',iou:'JPY', address: 'r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
			//{name: 'ExchgTokyo',iou:'JPY', address: 'r9ZFPSb1TFdnJwbTMYHvVwFK1bQPUCVNfJ',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
		]
	},
	{
		name: 'Bitcoin',
		currency: 'BTC',
		symbol:'Ƀ',
		gateways:
		[
			{name: 'bitstamp',iou:'BTC', address: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''},
			{name: 'btc2ripple',iou:'BTC', address: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
		]
	}
	/*
  ,
	{
		name: 'KoreaWon',
		currency: 'KRW',
		symbol:'₩',
		gateways:
		[
			{name: 'PaxMonetar',iou:'KRW', address: 'rUkMKjQitpgAM5WTGk79xpjT38DEJY283d',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
		]
	}
  ,
	{
		name: 'CanadaDollar',
		currency: 'CAD',
		symbol:'$',
		gateways:
		[
			{name: 'RippleUnion',iou:'CAD', address: 'r3ADD8kXSUKHd6zTCKfnKT3zV9EZHjzp1S',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
		]
	}
	,
	{
	name: 'SingaporeDollar',
	currency: 'SGD',
	symbol:'$',
	gateways:
	[
	{name: 'RippleSingapore',iou:'SGD', address: 'r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH',price:{value:0,action:'asks',low:null,high:null},volume:{xrp:null,iou:null},url:''}
]
}
{
name: 'Gold Bullion International',
currency: '0158415500000000C1F76FF6ECB0BAC600000000',
gateways:
[
{name: 'GBI', address: 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',priceid:'#gbigbi'}
]
}
*/
];
//setTimeout(loadExchgRate,10000);
if (async) {
	async.eachSeries(Markets, loadExchgRate, function(err) {
		if (err) console.log(err);
	});
} else {
	console.log("loadExchgRate,async not loaded");
}

function loadExchgRate(market, callback) {
	var curr = market.currency;
	if (curr == "BTC") {
		callback();
		return;
	}
	//var url="http://api.k780.com:88/?app=finance.rate&scur=USD&tcur="+curr+"&appkey=12416&sign=79a36d1d8c108269e7e354cc5e8a89fe&format=json";
  //http://api.k780.com:88/?app=finance.rate&scur=USD&tcur=CNY&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4
	var url = "http://api.k780.com:88/?app=finance.rate&scur=USD&tcur=" + curr + "&appkey=12416&sign=090d2b6396936230dace3dfae3128890&format=json&jsoncallback=?";
	//var url="https://id.ripple.com/v1/user/razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA";
	$.getJSON(url, function(data) {
		//console.log(data);
		if (data.success == "1") {
			var tcur = data.result.tcur;
			var rate = data.result.rate;
			ExchgRate[tcur] = rate;
			callback();
			//console.log(tcur,rate);
		} else {
			callback(data);
		}
	});
}


function subscribe() {
	var book;
	Markets.forEach(function(Market) {
		//console.log("init Market"+Market.name);
		var gateways = Market.gateways;
		gateways.forEach(function(gateway) {
			//console.log("init gateway:"+Gateways[gateway.address].name);
			['asks', 'bids'].forEach(function(action) {
				if (action == "asks") {
					book = remote.book({
						currency_gets: 'XRP',
						issuer_gets: null,
						currency_pays: Market.currency,
						issuer_pays: gateway.address
					});
				} else {
					book = remote.book({
						currency_gets: Market.currency,
						issuer_gets: gateway.address,
						currency_pays: 'XRP',
						issuer_pays: null
					});

				}
				book.on("trade", function(tradeGets, tradePays) {
					tradeListener(action, tradeGets, tradePays, Market.currency, gateway)
				});
			});
		});
	});
	//g$scope.$apply();
}

function resubscribe() {
	//console.log("timeout fresh-------------------------------------------------------");
	lastfreshdate = new Date();
	for (var id in remote._books) {
		remote._books[id].unsubscribe();
	}
	remote._books = {};
	subscribe();
}
var lastfreshdate = new Date();
setInterval(function() {
	if ((new Date() - lastfreshdate) > 180000) resubscribe();
}, 30000); //超过3分钟强制刷新数据，解决自动刷新意外终止问题
function tradeListener(action, tradeGets, tradePays, currency, gateway) {
	lastfreshdate = new Date();
	var price;
	var xrpamount;
	var coinamount;
	var pricecolor;
	var volumexrp, volumeiou;
	// Ripple-lib bug
	if (tradeGets.is_valid() || tradePays.is_valid()) {
		if (action == "asks") {
			price = tradeGets.ratio_human(tradePays).to_human();
			xrpamount = tradePays.to_human();
			coinamount = tradeGets.to_human();
			volumexrp = tradePays.to_number();
			volumeiou = tradeGets.to_number();
			pricecolor = "green";
		} else {
			price = tradePays.ratio_human(tradeGets).to_human();
			xrpamount = tradeGets.to_human();
			coinamount = tradePays.to_human();
			volumexrp = tradeGets.to_number();
			volumeiou = tradePays.to_number();
			pricecolor = "red";
		}
		price = price.substring(0, 9);
		if (_.isNaN(price) || price <= 0 || _.isNaN(volumexrp) || volumexrp < 1000000) return; //有时候数值价格小到0
		if (price < (gateway.price.low || 999999)) gateway.price.low = price;
		if (price > gateway.price.high) gateway.price.high = price;
		gateway.price.value = price;
		gateway.price.action = action;
		gateway.volume.xrp += droptoxrp(volumexrp);
		gateway.volume.iou += volumeiou;
		RangeTime.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
		//g$scope.$apply();
    if(ChangeDetector.ref) ChangeDetector.ref.detectChanges();
		var trade = {};
		trade.price = price;
		trade.time = stringDate(new Date());
		var pos = xrpamount.indexOf('.');
		if (pos > 0) xrpamount = xrpamount.substring(0, pos); //xrp数量取整
		trade.size = xrpamount + "XRP";
		if (window.localStorage) {
			var tradedata = {};
			if (localStorage.tradedata) {
				tradedata = JSON.parse(localStorage.tradedata);
			}
			tradedata[currency + gateway.address] = trade;
			localStorage.tradedata = JSON.stringify(tradedata);
		}
		// var content=$("#"+currency+gateway.address).attr("data-content");
		// if(content.length>1500)
		// {
		// 	content=content.substring(0,1200);
		// 	content=content.substring(0,content.lastIndexOf('<br>'));
		// }
		// $("#"+currency+gateway.address).attr("data-content",trade.time+" price:<font color='"+pricecolor+"'>"+trade.price+"</font> size:"+trade.size+"<br>"+content);
		//
	}
}
function initprice() {
	var tradedata = {};
	if (window.localStorage) {
		if (localStorage.tradedata) {
			tradedata = JSON.parse(localStorage.tradedata);
		}
	}
	for (var i = 0; i < Markets.length; i++) {
		for (var j = 0; j < Markets[i].gateways.length; j++) {
			var gateway = Markets[i].gateways[j];
			var trade = tradedata[Markets[i].currency + gateway.address];
			gateway.price.action = 'gray';
			gateway.price.value = trade ? trade.price : 0;
			gateway.url = Gateways[gateway.address].weburl;
		}
	}
}
initprice();
startGetPrice();
