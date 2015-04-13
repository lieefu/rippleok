'use strict';
var istimeout = false;
var account;
var url;
var g$scope;
angular.module('accountApp').controller('AccountCtrl', function($scope, $location) {
  g$scope = $scope;
  $scope.lang = getLang();
  $scope.setlang = function(l) {
    $scope.lang = l;
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
  $scope.queryAccountInfo = function() {
    account = $("#address")[0].value;
    //window.location.href = url + "#" + account;
    $location.hash(account)
      //console.log(window.location.href ,url);
    window.location.reload();
  }
  var urlhash = $location.hash();
  //console.log("urlhash:",urlhash);
  account = $("#address")[0].value = urlhash;
  if (account.length <= 0) return;
  url = $location.path();
  rippleName(account);
  if (account[0] === '~') {
    //console.log(account+'return');
    return;
  }
  accountinfo(account);
  accountoffers(account);
  loadTXS();
});

remote.connect(function() {});

function accountinfo(account) {
  var req = remote.request('account_info', {
    account: account
  });
  req.request(function(err, res) {
    if (!err) {
      //$("#accountinfo").html(JSON.stringify(res));
      procAccountInfo(res);
      accountlines(account);
      //console.log(res);
    } else {
      $("#ripplename").html(err.error_message);
      //console.log(err);
      //console.log(res);
    }
  });
}
var debt = {}; //amount
var debtCount = {}; //funded accounts
var trustCount = {}; //trust without fund
function accountlines(account) {
  //console.log("account_lines .............");
  g$scope.funds = [];
  g$scope.issuers = [];
  g$scope.$apply();
  if (istimeout) {
    $("#requery").attr("class", "hide");
  } else istimeout = true;
  setTimeout(function() {
    if (istimeout) {
      $("#requery").attr("class", "");
    }
  }, 30000);
  var options = {
    account: account,
    ledger: 'validated'
  }
  debt = {}; //amount
  debtCount = {}; //funded accounts
  trustCount = {}; //trust without fund
  getLines(options);
  function getLines(options){
    //console.log("options:",JSON.stringify(options));
    remote.requestAccountLines(options,  function(err, res) {
        if (!err) {
          //$("#accountlines").html(JSON.stringify(res));
          //console.log("account_lines .............success"+res.lines.length);
          istimeout = false;
          $("#requery").attr("class", "hide");
          procAccountLines(res);
          if(res.marker){
            options.marker = res.marker;
            options.ledger = res.ledger_index;//?res.ledger_index:res.ledger_current_index;
            getLines(options);
          }
        } else {
          console.log("account_lines error:" + err);
        }
      });
  }
}

function accountoffers(account) {
  //console.log("account_offers .............");
  g$scope.offers = [];
  //g$scope.$apply();

  var req = remote.request('account_offers', {
    account: account
  });
  req.request(function(err, res) {
    if (!err) {
      //$("#accountoffers").html(JSON.stringify(res));
      //console.log("account_offers  .............success"+res.offers.length);
      procAccountOffers(res);
    } else {
      //console.log("account_offers error:"+err);
    }
  });
}
var txoptions = {
  "account": "",
  "ledger_index_min": -1,
  "ledger_index_max": -1,
  "binary": false,
  "count": false,
  "descending": true,
  "offset": 0,
  "limit": 100,
  "forward": false
}

function loadTXS() {
  $("#txLoading").show();
  $("#loadmore").hide();
  g$scope.txs = [];
  txoptions.offset = 0;
  accounttxs(account);
}

function loadMoreTXS() {
  $("#txLoading").show();
  $("#loadmore").hide();
  txoptions.offset += txoptions.limit;
  accounttxs(account);
}

function accounttxs(account) {
  //console.log("account_tx .............f");
  txoptions.account = account;
  var req = remote.request('account_tx', txoptions);
  req.request(function(err, res) {
    $("#txLoading").hide();
    if (!err) {
      //$("#accounttxs").html(JSON.stringify(res));
      //console.log("account_tx  .............success"+res.transactions.length);
      if (res.transactions.length > 0) {
				//console.log(res.transactions);
        $("#loadmore").show();
        procTransactions(res);
      }
    } else {
			$("#loadmore").show();
      console.log("account_tx error:" + err);
    }
  });
}

function rippleName(address) {
  //console.log(address);
  $("#ripplename").html("loading");
  $.getJSON("https://id.ripple.com/v1/user/" + address, {}, function(res) {
    if (res.exists) {
      if (address[0] == '~') {
        account = res.address;
        accountinfo(account);
        accountoffers(account);
        loadTXS();
        saveripplenameMap(res.address, res.username);
        $("#ripplename").html(address);
        return;
      }
      saveripplenameMap(address, res.username);
      $("#ripplename").html("~" + res.username);
    } else {
      $("#ripplename").html("no ripple name");
    }
  });
}
var AccountRootFlags = {
  PasswordSpent: {
    name: 'password_spent',
    value: 0x00010000
  },
  RequireDestTag: {
    name: 'require_destination_tag',
    value: 0x00020000
  },
  RequireAuth: {
    name: 'require_authorization',
    value: 0x00040000
  },
  DisallowXRP: {
    name: 'disallow_xrp',
    value: 0x00080000
  },
  DisableMaster: {
    name: 'disable_master',
    value: 0x00100000
  },
  NoFreeze: {
    name: 'no_freeze',
    value: 0x00200000
  },
  GlobalFreeze: {
    name: 'global_freeze',
    value: 0x00400000
  }
};

function procAccountInfo(accountinfo) {
  var account_data = accountinfo.account_data;
  g$scope.accountsetting = [];
  $("#rippleaddress").html(account_data.Account);
  var xrpsum = droptoxrp(account_data.Balance);
  var freeze = account_data.OwnerCount * 5 + 20;
  $("#xrp").html("<span class='currency XRP'></span>" + comma(xrpsum) + " (Freeze: " + freeze + ")");

  var avatar = account_data.urlgravatar;
  if (avatar) $("#avatar").html('<img src="' + avatar + '">');
  var domain = account_data.Domain;
  if (domain) $("#domain").html("<a href='http://" + ascify(domain) + "' target='_blank'>" + ascify(domain) + "</a>");
  var transferRate = account_data.TransferRate;
  var sequence = account_data.Sequence;
  $("#otherinfo").html("Sequence: " + sequence);
  if (transferRate) $("#otherinfo").append('  TransferRate: ' + toTransferRate(transferRate) + '%');
  for (var flagName in AccountRootFlags) {
    var flag = AccountRootFlags[flagName];
    g$scope.accountsetting.push({
      name: flagName,
      value: Boolean(account_data.Flags & flag.value)
    });
  }
}

function procAccountLines(data) {
  var lines = data.lines;
  var curname;
  for (var index in lines) {
    var node = lines[index];
    var account = node.account;
    var currency = node.currency;
    var amount = node.balance;
    var limit = node.limit;
    var limit_peer = node.limit_peer;
    var no_ripple = node.no_ripple;
    if (amount >= 0) { //credit 拥有别人发行的资金余额
      if (limit > 0) {
        curname = currency;
        if (curname == "0158415500000000C1F76FF6ECB0BAC600000000") curname = "XAU";
        g$scope.funds.push({
          currency: curname,
          amount: comma(amount),
          issuer: account,
          limit: limit,
          no_ripple: no_ripple
        });
      }
    } else { //debt (amount < 0)
      if (currency in debt) {
        debt[currency] += +amount;
        debtCount[currency]++;
      } else {
        debt[currency] = +amount;
        debtCount[currency] = 1;
      }
    }
    if (limit_peer > 0 && amount == 0) { //trust only
      if (currency in trustCount) trustCount[currency]++;
      else trustCount[currency] = 1;
    }
  }
  g$scope.issuers=[];
  for (var cur in debt) {
    if (!(cur in trustCount)) trustCount[cur] = 0;
    curname = cur;
    if (curname == "0158415500000000C1F76FF6ECB0BAC600000000") curname = "XAU";
    g$scope.issuers.push({
      currency: curname,
      amount: comma(debt[cur]),
      trustlines: (trustCount[cur] + debtCount[cur]),
      depositor: debtCount[cur]
    });
  }
  g$scope.$apply();
}

function procAccountOffers(data) {
  var offers = data.offers;
  var prompt1, prompt2;
  var goodssize, moneysize;
  offers.forEach(function(offer) {
    //console.log(offer);
    var taker_gets = offer.taker_gets;
    var taker_pays = offer.taker_pays;
    if (taker_gets.value && taker_pays.value) { //两者都不是XRP
      g$scope.offers.push({
        prompt1: "Exchange",
        goods: taker_gets.value + taker_gets.currency,
        goodsissuer: taker_gets.issuer,
        prompt2: "for : ",
        money: taker_pays.value + taker_pays.currency,
        moneyissuer: taker_pays.issuer,
        price: (taker_gets.value / taker_pays.value) + taker_gets.currency + "/" + taker_pays.currency,
        color: "grey"
      });

    } else if (taker_gets.value) { //buy xrp
      goodssize = parseFloat(droptoxrp(taker_pays));
      moneysize = parseFloat(taker_gets.value);
      g$scope.offers.push({
        prompt1: "Buy ",
        goods: comma(goodssize) + "XRP",
        goodsissuer: "",
        prompt2: "with ",
        money: comma(moneysize) + taker_gets.currency,
        moneyissuer: taker_gets.issuer,
        price: (moneysize / goodssize).toFixed(10),
        color: "green"
      });
    } else {
      goodssize = parseFloat(droptoxrp(taker_gets));
      moneysize = parseFloat(taker_pays.value);
      g$scope.offers.push({
        prompt1: "Sell ",
        goods: comma(goodssize) + "XRP",
        goodsissuer: "",
        prompt2: "for : ",
        money: comma(moneysize) + taker_pays.currency,
        moneyissuer: taker_pays.issuer,
        price: (moneysize / goodssize).toFixed(10),
        color: "red"
      });
    }
    g$scope.$apply();

  });
}

function procTransactions(data) {
  var account = data.account;
  var transactions = data.transactions;
  transactions.forEach(function(transaction) {
    var tx = transaction.tx;
    var meta = transaction.meta;
    var TransactionType = tx.TransactionType;
    //console.log(transaction);
    //console.log(tx.Account);
    //console.log(account);
    switch (TransactionType) {
      case "OfferCreate":
        procOfferCreate(account, tx, meta);
        break;
      case "Payment":
        procPayment(account, tx, meta);
        break;
      case "TrustSet":
        procTrustSet(account, tx, meta);
        break;
      case "OfferCancel":
        procOfferCancel(account, tx, meta);
        break;
    }
  });
  g$scope.$apply();
  //console.log("proc tx"+transactions.length);
}

function procTrustSet(account, tx, meta) {
  if (tx.Account != account) return;
  g$scope.txs.push({
    "Sequence": tx.Sequence,
    "TransactionType": tx.TransactionType,
    "LimitAmount": tx.LimitAmount,
    "Fee": tx.Fee,
    "date": rippleDate(tx.date),
    "txhash": tx.hash
  });
}

function procOfferCancel(account, tx, meta) {
  if (tx.Account != account) return;
  g$scope.txs.push({
    "Sequence": tx.Sequence,
    "TransactionType": tx.TransactionType,
    "OfferSequence": tx.OfferSequence,
    "Fee": tx.Fee,
    "date": rippleDate(tx.date),
    "txhash": tx.hash
  });
  var fill = {};
  fill.TransactionType = tx.TransactionType;
  fill.txhash = tx.hash;
  fill.date = rippleDate(tx.date);
  fill.Sequence = tx.Sequence;
  var TXS = getTXS(tx.OfferSequence);
  TXS.cancel = true;
  TXS.classname = "cancel";
  TXS.fills.unshift(fill);
}

function procPayment(account, tx, meta) {
  var amount = toAmount(tx.Amount, meta);
  var type, prep, counterparty, Sequence;
  if (tx.Account == account) { //本账户发送支付
    Sequence = tx.Sequence;
    if (tx.Destination === address) {
      type = 'Exchange';
    } else {
      type = 'Send';
      prep = "to";
      counterparty = tx.Destination;
    }
  } else if (tx.Destination == account) { ////本账户接收支付
    Sequence = "null";
    type = 'Receive';
    prep = "from";
    counterparty = tx.Account;
  } else { //该支付交易通过本账户的交易挂单完成的，加入offercreate filled数据中
    procAffectedNodes(account, tx, meta);
    return;
  }
  g$scope.txs.push({
    "Sequence": Sequence,
    "TransactionType": tx.TransactionType,
    "type": type,
    "prep": prep,
    "counterparty": counterparty,
    "amount": amount,
    "date": rippleDate(tx.date),
    "txhash": tx.hash
  });
}

function getTXS(Sequence) {
  //	g$scope.txs.forEach(function(tx){
  //		if(tx.Sequence==Sequence) return tx;//return 不能阻止forEach的循环
  //	});
  for (var i = 0; i < g$scope.txs.length; i++) {
    if (g$scope.txs[i].Sequence == Sequence) return g$scope.txs[i];
  }
  var tx = {
    "Sequence": Sequence,
    "TransactionType": null,
    "TakerGets": null,
    "TakerPays": null,
    "Fee": null,
    "date": null,
    "hash": null,
    "filled": false,
    "cancel": false,
    "classname": "",
    "fills": [],
    "memos": null
  };
  g$scope.txs.push(tx);
  return tx;
}

function procOfferCreate(account, tx, meta) {

  if (tx.Account == account) { //本账户创建的offer

    var TXS = getTXS(tx.Sequence);
    TXS.TransactionType = tx.TransactionType;
    TXS.TakerGets = tx.TakerGets;
    TXS.TakerPays = tx.TakerPays;
    TXS.Fee = droptoxrp(tx.Fee);
    TXS.date = rippleDate(tx.date);
    TXS.txhash = tx.hash;
    TXS.memos = parseMemos(tx.Memos);
    ////////////////////
    var prompt1, prompt2;
    var goodssize, moneysize;
    var taker_gets = tx.TakerGets;
    var taker_pays = tx.TakerPays;
    if (taker_gets.value && taker_pays.value) { //两者都不是XRP
      TXS.prompt1 = "Exchange";
      TXS.goods = taker_gets.value + taker_gets.currency;
      TXS.goodsissuer = taker_gets.issuer;
      TXS.prompt2 = "for : ";
      TXS.money = taker_pays.value + taker_pays.currency;
      TXS.moneyissuer = taker_pays.issuer;
      TXS.price = (taker_gets.value / taker_pays.value) + taker_gets.currency + "/" + taker_pays.currency;
      TXS.color = "grey";

    } else if (taker_gets.value) { //buy xrp
      goodssize = parseFloat(droptoxrp(taker_pays));
      moneysize = parseFloat(taker_gets.value);
      TXS.prompt1 = "Buy ";
      TXS.goods = comma(goodssize) + "XRP";
      TXS.goodsissuer = "";
      TXS.prompt2 = "with ";
      TXS.money = comma(moneysize) + taker_gets.currency;
      TXS.moneyissuer = taker_gets.issuer;
      TXS.price = (moneysize / goodssize).toFixed(10);
      TXS.color = "green";
    } else {
      goodssize = parseFloat(droptoxrp(taker_gets));
      moneysize = parseFloat(taker_pays.value);
      TXS.prompt1 = "Sell ";
      TXS.goods = comma(goodssize) + "XRP";
      TXS.goodsissuer = "";
      TXS.prompt2 = "for : ";
      TXS.money = comma(moneysize) + taker_pays.currency;
      TXS.moneyissuer = taker_pays.issuer;
      TXS.price = (moneysize / goodssize).toFixed(10);
      TXS.color = "red";
    }
    ///////////////////////////////
  } else { //其它账户的Offer,影响改变了(交易了)本账户Offer
    procAffectedNodes(account, tx, meta);
  }
}

function procAffectedNodes(account, tx, meta) {
  var AffectedNodes = meta.AffectedNodes;
  var fill = {
    volume: [],
    OfferBalance: [],
    AccountBalance: []
  };
  var FinalFields;
  AffectedNodes.forEach(function(node) {
    var nodetype;
    for (nodetype in node) {} //获得节点类型，ModifiedNode DeletedNode CreatedNode
    //console.log("nodetype="+nodetype+"vlue="+node[nodetype]);
    var LedgerEntryType = node[nodetype].LedgerEntryType;

    switch (LedgerEntryType) { //RippleState调整XRP余额；AccountRoot调整IOU余额，DirectoryNode 还不知道是何意义
      case "Offer":
        FinalFields = node[nodetype].FinalFields;
        if (!FinalFields) return; //有些Offer 在 nodetype 是CreatedNode 只有 NewFields
        if (FinalFields.Account != account) return; //未影响本账户Offer
        var PreviousFields = node[nodetype].PreviousFields;
        //console.log("nodetype="+nodetype+"FinalFields="+FinalFields.Account+"       "+account);
        if (nodetype == "DeletedNode") { //本Offer已经被完成交易
          getTXS(FinalFields.Sequence).filled = true;
          getTXS(FinalFields.Sequence).classname = "filled";
        }
        //console.log("496",FinalFields.Sequence);
        fill.Sequence = FinalFields.Sequence; //大单有可能一次砸穿两个以上单子
        //if(fill.Sequence==496){
        //	console.log("496",fill);
        //}
        fill.type = nodetype;
        //if(!PreviousFields){
        //	console.log("-------------------------------------------------------------------");
        //	console.log(JSON.stringify(node));
        //	console.log("-------------------------------------------------------------------");
        //	console.log(JSON.stringify(tx));
        //  console.log("-------------------------------------------------------------------");
        //	console.log(JSON.stringify(meta));
        //}

        fill.after = {
          "TakerGets": FinalFields.TakerGets,
          "TakerPays": FinalFields.TakerPays
        };
        if (PreviousFields)
          fill.before = {
            "TakerGets": PreviousFields.TakerGets,
            "TakerPays": PreviousFields.TakerPays
          };
        else
          fill.before = fill.after;
        if (!FinalFields.TakerGets.value) { //XRP交易量
          fill.volume.push(comma(droptoxrp(fill.before.TakerGets - fill.after.TakerGets)) + "XRP");
          fill.OfferBalance.push(comma(droptoxrp(fill.after.TakerGets)) + "XRP");
        } else { //IOU交易量
          fill.volume.push((fill.before.TakerGets.value - fill.after.TakerGets.value) + fill.after.TakerGets.currency);
          fill.OfferBalance.push(fill.after.TakerGets.value + fill.after.TakerGets.currency);
        }
        if (!FinalFields.TakerPays.value) { //XRP交易量
          fill.volume.push(comma(droptoxrp(fill.before.TakerPays - fill.after.TakerPays)) + "XRP");
          fill.OfferBalance.push(comma(droptoxrp(fill.after.TakerPays)) + "XRP");
        } else { //IOU交易量
          fill.volume.push((fill.before.TakerPays.value - fill.after.TakerPays.value) + fill.after.TakerPays.currency);
          fill.OfferBalance.push(fill.after.TakerPays.value + fill.after.TakerPays.currency);
        }
        fill.TransactionType = tx.TransactionType;
        fill.Account = tx.Account;
        fill.txhash = tx.hash;
        fill.date = rippleDate(tx.date);
        break;
      case "RippleState": //IOU余额
        FinalFields = node[nodetype].FinalFields;
        if (!FinalFields) return;
        var LowLimit = FinalFields.LowLimit;
        if (!LowLimit) return;
        if (LowLimit.issuer != account) return;
        fill.AccountBalance.push(FinalFields.Balance.value + FinalFields.Balance.currency);
        break;
      case "AccountRoot": //XRP余额
        FinalFields = node[nodetype].FinalFields;
        if (!FinalFields) return;
        if (FinalFields.Account != account) return;
        fill.AccountBalance.push(comma(droptoxrp(FinalFields.Balance)) + "XRP");
        break;
    } //end switch
  });
  //console.log("496-2",fill);
  if (fill.Sequence) {
    //if(fill.Sequence==496) console.log(fill);
    getTXS(fill.Sequence).fills.unshift(fill);
  }

}

function parseMemos(memos) {
  var ret = "";
  //console.log("memos",memos);
  for (var memo in memos) {
    var mType = Utils.hexToString(memos[memo].Memo.MemoType);
    var mData = memos[memo].Memo.MemoData ? Utils.hexToString(memos[memo].Memo.MemoData) : '';
    var mFormat = memos[memo].Memo.MemoFormat ? Utils.hexToString(memos[memo].Memo.MemoFormat) : '';
    try {
      mData = JSON.stringify(JSON.parse(mData), null, 2);
    } catch (e) {};
    ret += mType + ":" + mData + ':' + mFormat + ";";
  }
  //console.log("memos",ret);
  return ret;
}

function toTransferRate(rate) {
  return (rate / 1000000 - 1000) / 10;
}
