var gateway = {
  name: '',
  address: '',
  currency: '',
  weburl: '',
};

var goods = {
  currency: '',
  issuer: ''
};
var money = {
  currency: '',
  issuer: ''
}
remote.on('state', function(state) {
  console.log('remote state:');
  console.log(JSON.stringify(state));
})
init();
var url;

function init() {
  url = decodeURIComponent(document.URL);
  var separator = "";
  if (url.indexOf("#") >= 0) separator = "#";
  if (url.indexOf("?address=") >= 0) separator = "?address=";
  if (separator == "") return;
  var goodsmoneyissuer = url.split(separator)[1].trim();
  url = url.split(separator)[0];
  window.location.href = url + "#" + goodsmoneyissuer;
  $("#address")[0].value = goodsmoneyissuer;
  parseGoodsmoneyissuer(goodsmoneyissuer);
}

function queryGatewayInfo() {
  console.log("queryGatewayInfo");
  window.location.href = url + "#" + $("#address")[0].value;
  window.location.reload();
}

function parseGoodsmoneyissuer(goodsmoneyissuer) {
  goods.currency = money.currency = "";
  if (goodsmoneyissuer.indexOf('.') >= 0) {
    var goodsmoney = goodsmoneyissuer.split('.')[0].trim().toUpperCase();
    var issuer = goodsmoneyissuer.split('.')[1].trim();
    if (goodsmoney.indexOf('/') > 0) {
      goods.currency = goodsmoney.split('/')[0].trim();
      money.currency = goodsmoney.split('/')[1].trim();
    } else {
      goods.currency = 'XRP';
      money.currency = goodsmoney;
    }
    goods.issuer = (goods.currency == "XRP" ? null : issuer);
    money.issuer = (money.currency == "XRP" ? null : issuer);
    if (Gateways[issuer]) {
      gateway.name = Gateways[issuer].name;
      gateway.address = issuer;
      gateway.weburl = Gateways[issuer].weburl;
    } else {
      gateway.name = account2name(issuer);
      gateway.address = issuer;
    }
  }

}
remote.connect(function() {
  //remote.on('transaction_all', transactionListener);
  loadoffers();
  //setTimeout(booksubscribe,5000);
});
var asksbook, bidsbook;

function booksubscribe() {
  console.log("booksubscribe...................");
  asksbook = remote.book({
    currency_gets: goods.currency,
    issuer_gets: goods.issuer,
    currency_pays: money.currency,
    issuer_pays: money.issuer
  });
  bidsbook = remote.book({
    currency_gets: money.currency,
    issuer_gets: money.issuer,
    currency_pays: goods.currency,
    issuer_pays: goods.issuer
  });
  asksbook.on("model", function(offers) {
    receiveOffers("asks", offers, "auto")
  });
  bidsbook.on("model", function(offers) {
    receiveOffers("bids", offers, "auto")
  });
  ///////////////////////////
  asksbook.on("trade", function(tradePays, tradeGets) {
    tradeListener("asks", tradePays, tradeGets)
  });
  bidsbook.on("trade", function(tradePays, tradeGets) {
    tradeListener("bids", tradePays, tradeGets)
  });
  //////////////////////////////////////////////////
  asksbook.on("offer_added", function(offer) {
    offerListener("asks", offer, "added")
  });
  bidsbook.on("offer_added", function(offer) {
    offerListener("bids", offer, "added")
  });
  ////////////////////////////////
  asksbook.on("offer_removed", function(offer) {
    offerListener("asks", offer, "removed")
  });
  bidsbook.on("offer_removed", function(offer) {
    offerListener("bids", offer, "removed")
  });
}

function bookresubscribe() {
  if (asksbook) asksbook.unsubscribe();
  if (bidsbook) bidsbook.unsubscribe();
  remote._books = {};
  setTimeout(booksubscribe, 5000);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadoffers(callback) {
    //console.log("下载挂单数据...............");
    if (money.currency == '') return;
    $("#txLoading").show();
    bookresubscribe();
    var finish = 0;
    //remote.request('book_offers',{taker_gets: {'currency':'XRP'},
    //							  taker_pays: {'currency':'CNY','issuer': 'razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA'}})
    remote.request('book_offers', {
        taker_gets: goods,
        taker_pays: money
      })
      .request(function(err, res) {
        $("#txLoading").hide();
        if (!err) {
          receiveOffers("asks", res.offers, "manual");
          finish++;
          if (finish > 1) {
            if (callback) callback();
          }
        } else {
          console.log("Offer query failed"); //订单查询失败");
        }
      });
    //remote.request('book_offers', {taker_gets: {'currency':'CNY','issuer': 'razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA'},
    //							   taker_pays: {'currency':'XRP'}})
    remote.request('book_offers', {
        taker_gets: money,
        taker_pays: goods
      })
      .request(function(err, res) {
        if (!err) {
          receiveOffers("bids", res.offers, "manual");
          finish++;
          if (finish > 1) {
            if (callback) callback();
          }
        } else {
          console.log("Offer query failed"); //订单查询失败");
        }
      });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
var lastfreshdate = new Date();
setInterval(function() {
  if ((new Date() - lastfreshdate) > 180000) loadoffers();
}, 30000); //超过3分钟强制刷新数据，解决自动刷新意外终止问题


function receiveOffers(action, Offers, type) {
  console.log("receiveOffers..................." + action + "  " + type);
  lastfreshdate = new Date();
  var goodssize, goodssum = 0;
  var moneysize, moneysum = 0;
  var price;
  var account;
  var takerGets, takerPays;
  var buyoffers = [],
    saleoffers = [];
  //console.log("action："+action+"  tradeGets："+JSON.stringify(offers[0])+"   currency:"+currency+"    gatewayName"+gatewayName);
  Offers.forEach(function(offer) {
    account = offer.Account;
    takerGets = offer.TakerGets;
    takerPays = offer.TakerPays;
    if (action == "asks") {
      takerGets.value ? goodssize = takerGets.value : goodssize = takerGets / 1000000;
      takerPays.value ? moneysize = takerPays.value : moneysize = takerPays / 1000000;
    } else {
      takerPays.value ? goodssize = takerPays.value : goodssize = takerPays / 1000000;
      takerGets.value ? moneysize = takerGets.value : moneysize = takerGets / 1000000;
    }
    goodssum += parseFloat(goodssize);
    moneysum += parseFloat(moneysize);
    price = (moneysize / goodssize).toFixed(5);
    var accountlength = account.length;
    var account_short = account.substr(0, 5) + "..." + account.substring(accountlength - 3, accountlength);
    var offerobj = {
      "account": account,
      "account_short": account_short,
      "price": price,
      "goodssize": parseFloat(goodssize).toFixed(0),
      "goodssum": goodssum.toFixed(0),
      "moneysize": parseFloat(moneysize).toFixed(2),
      "moneysum": moneysum.toFixed(2)
    }
    if (action == "asks") {
      saleoffers.push(offerobj);
    } else {
      buyoffers.push(offerobj);
    }
  });

  if (action == "asks") {
    g$scope.saleofferstime = nowdatetime() + " via " + type;
    g$scope.saleoffers = saleoffers;
    g$scope.restsaleofferssize = saleoffers.length - g$scope.pagesize;
  } else {
    g$scope.buyofferstime = nowdatetime() + " via " + type;
    g$scope.buyoffers = buyoffers;
    g$scope.restbuyofferssize = buyoffers.length - g$scope.pagesize;
  }
  g$scope.$apply();
  //Offers.length=0;//ripple_lib bug,after a long time,offers become biger
  //Offers.splice(0,Offers.length);
}

function offerListener(action, offer, op) {
  console.log("offerListener..................." + action + "  " + op + g$scope.onOfferlog);
  if (!g$scope.onOfferlog) return;
  var goodssize;
  var moneysize;
  var price;
  var account;
  var color;
  var actionforshow, offerinfo;
  var opinfo = "cancel";
  if (op == "added") opinfo = "add";
  account = offer.Account;
  takerGets = offer.TakerGets;
  takerPays = offer.TakerPays;
  if (action == "asks") {
    takerGets.value ? goodssize = takerGets.value : goodssize = takerGets / 1000000;
    takerPays.value ? moneysize = takerPays.value : moneysize = takerPays / 1000000;
    actionforshow = "sale order";
    color = "red";
  } else {
    takerPays.value ? goodssize = takerPays.value : goodssize = takerPays / 1000000;
    takerGets.value ? moneysize = takerGets.value : moneysize = takerGets / 1000000;
    actionforshow = "buy order";
    color = "green";
  }
  price = moneysize / goodssize;
  offerinfo = account + " " + opinfo + " " + actionforshow + " price:" + price + "  " + goodssize + goods.currency + "  " + moneysize + money.currency;
  var offerinfoobj = {
    "datetime": nowdatetime(),
    "info": offerinfo,
    "color": "gray",
  };
  print(offerinfoobj);
}

function tradeListener(action, tradePays, tradeGets) {
  console.log("tradeListener..................." + action);
  var price;
  var goodssize;
  var moneysize;
  var issuerAddress;
  var color;
  var actionforshow, tradeinfo;
  if (tradeGets.is_valid() || tradePays.is_valid()) {

    if (action == "asks") {
      price = tradePays.ratio_human(tradeGets).to_human();
      goodssize = tradeGets.to_human() + goods.currency;
      moneysize = tradePays.to_human() + money.currency;
      issuerAddress = tradePays._issuer.to_json();
      color = "green";
      actionforshow = "buy"; //卖单成交，提示买
    } else {
      price = tradeGets.ratio_human(tradePays).to_human();
      goodssize = tradePays.to_human() + goods.currency;
      moneysize = tradeGets.to_human() + money.currency;
      issuerAddress = tradeGets._issuer.to_json();
      color = "red";
      actionforshow = "sale";
    }
    tradeinfo = actionforshow + " price:" + price.substring(0, 6) + "  " + goodssize + "  " + moneysize;
    var tradeinfoobj = {
      "datetime": nowdatetime(),
      "info": tradeinfo,
      "color": color,
    };
    print(tradeinfoobj);
  }
}

function print(msgobj) {
  var len = g$scope.loglist.unshift(msgobj);
  //console.log("show log"+msgobj.info);
  if (len > 500) {
    g$scope.loglist.splice(100, len - 100);
    //console.log(g$scope.loglist.length);
  }
  g$scope.$apply();
}

function nowdatetime() {
  var now = new Date();
  var year = now.getFullYear(); //getFullYear getYear
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var day = now.getDay();
  var hour = now.getHours();
  var minu = now.getMinutes();
  var sec = now.getSeconds();
  //var week;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  //var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
  //week = arr_week[day];
  return year + "/" + month + "/" + date + "/" + " " + hour + ":" + minu + ":" + sec;
}
