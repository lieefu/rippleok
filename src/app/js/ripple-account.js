'use strict';

export var ngChangeDetector = {
    ref: null
};
export var cur_address;
export var setting = [];
export var txs = [];
export var funds = [];
export var issuers = [];
export var offers = [];
export function start(accountid) {
    cur_address = accountid;
    rippleName();
}

function getAccountinfo(accountid) {
    console.log("Begin get ripple account info" + cur_address);
    if (rippleconnected) {
        accountinfo();
        return;
    }
    rippleConnect(accountinfo);
}

function rippleName() {
    $("#ripplename").html("loading");
    $.getJSON("https://id.ripple.com/v1/user/" + cur_address, {}, function(res) {
        if (res.exists) {
            if (cur_address[0] == '~') {
                cur_address = res.address;
            }
            $("#ripplename").html("~" + res.username);
            saveripplenameMap(res.address, res.username);
        } else {
            $("#ripplename").html("no ripple name");
        }
        getAccountinfo(cur_address);
        accountoffers(cur_address);
        loadTXS();
    });
}

var options = {
    account: cur_address,
    ledger: 'validated'
}
var debt = {}; //amount
var debtCount = {}; //funded accounts
var trustCount = {}; //trust without fund

function accountinfo() {
    //console.log("Begin get ripple account info------" + cur_address);
    var req = remote.request('account_info', {
        account: cur_address
    });
    req.request(function(err, res) {
        if (!err) {
            //$("#accountinfo").html(JSON.stringify(res));
            procAccountInfo(res);
            accountlines(cur_address);
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
var istimeout = false;

function accountlines(cur_address) {
    //console.log("account_lines .............");
    funds = [];
    issuers = [];
    freshNg("account",ngChangeDetector);
    if (istimeout) {
        $("#requery").attr("class", "hide");
    } else istimeout = true;
    setTimeout(function() {
        if (istimeout) {
            $("#requery").attr("class", "");
        }
    }, 30000);
    var options = {
        account: cur_address,
        ledger: 'validated'
    }
    debt = {}; //amount
    debtCount = {}; //funded accounts
    trustCount = {}; //trust without fund
    getLines(options);
}

function getLines(options) {
    //console.log("options:",JSON.stringify(options));
    remote.requestAccountLines(options, function(err, res) {
        if (!err) {
            //$("#accountlines").html(JSON.stringify(res));
            //console.log("account_lines .............success" + res.lines.length);
            istimeout = false;
            $("#requery").attr("class", "hide");
            procAccountLines(res);
            if (res.marker) {
                options.marker = res.marker;
                options.ledger = res.ledger_index; //?res.ledger_index:res.ledger_current_index;
                getLines(options);
            }
        } else {
            console.log("account_lines error:" + err);
        }
    });
}

function accountoffers(cur_address) {
    //console.log("account_offers .............");
    offers = [];
    freshNg("account",ngChangeDetector);

    var req = remote.request('account_offers', {
        account: cur_address
    });
    req.request(function(err, res) {
        if (!err) {
            //$("#accountoffers").html(JSON.stringify(res));
            //console.log("account_offers  .............success"+res.offers.length);
            procAccountOffers(res);
        } else {
            console.log("account_offers error:" + err);
        }
    });
}
//2015年5月19日，发现用ripple-lib 获得的交易历史数据不全，只能获得12259340总账以后的交易数据，因此更改为使用
// curl 'https://history.ripple.com/v1/accounts/raQ5Lk4WwEzqYVy83Afwq2FL6vKTaN7PQ/transactions?limit=50&offset=50&type=Payment,OfferCreate,OfferCancel,TrustSet,AccountSet' -H 'Origin: https://www.rippletrade.com' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-TW;q=0.2' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36' -H 'Accept: application/json, text/plain, */*' -H 'Referer: https://www.rippletrade.com/' -H 'Connection: keep-alive' --compressed
//curl 'https://history.ripple.com/v1/accounts/raQ5Lk4WwEzqYVy83Afwq2FL6vKTaN7PQ/transactions?count=true&type=Payment,OfferCreate,OfferCancel,TrustSet,AccountSet' -H 'Origin: https://www.rippletrade.com' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-TW;q=0.2' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36' -H 'Accept: application/json, text/plain, */*' -H 'Referer: https://www.rippletrade.com/' -H 'Connection: keep-alive' --compressed
//{"result":"success","count":1085}
var txoptions = {
    account: cur_address,
    limit: 100,
    offset: 0,
    type: 'Payment,OfferCreate,OfferCancel,TrustSet,AccountSet'
}

function loadTXS() {
    console.log("loadTXS .............");
    $("#txLoading").show();
    $("#loadmore").hide();
    txs = [];
    txoptions.offset = 0;
    accounttxs(cur_address);
}
export function showfills (filldiv) {
		$(filldiv).slideToggle(1000);
	}
export function loadMoreTXS() {
    $("#txLoading").show();
    $("#loadmore").hide();
    //txoptions.offset += txoptions.limit;
    accounttxs(cur_address);
}

function accounttxs(cur_address) {
  console.log("loadTXS accounttxs............."+cur_address);
  //https://data.ripple.com/v2/accounts/rJwRzFE2rwVWXKb1SfKfuwjbuPFeTedxxP/transactions?descending=true&limit=100&offset=0&type=
  var txurl="https://data.ripple.com/v2/accounts/" + cur_address + "/transactions?descending=true&limit=" + txoptions.limit + "&type=";// + txoptions.type
  if(txoptions.marker){
    txurl="https://data.ripple.com/v2/accounts/" + cur_address + "/transactions?descending=true&limit=" + txoptions.limit + "&marker=" + txoptions.marker + "&type=";// + txoptions.type
  }
    $.get(txurl,
        function(res) {
            $("#txLoading").hide();
            //$("#accounttxs").html(JSON.stringify(res));
            console.log("account_tx  .............success" + res.transactions.length);

            if(res.marker){
              txoptions.marker = res.marker;
                $("#loadmore").show();
            }else{
              txoptions.marker = null;
            }
            if (res.transactions.length > 0) {
                //console.log(res.transactions);
                res.account = cur_address;
                procTransactions(res);
            }

        });
    // .error(function(err) {
    //     $("#txLoading").hide();
    //     $("#loadmore").show();
    //     console.log("account_tx error:" + err);
    // })
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
    //console.log("accountinfo");
    var account_data = accountinfo.account_data;
    setting = [];
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
        setting.push({
            name: flagName,
            value: Boolean(account_data.Flags & flag.value)
        });
    }
    //if (ngChangeDetector.ref) ngChangeDetector.ref.detectChanges();
    freshNg("account",ngChangeDetector);
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
                funds.push({
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
    issuers = [];
    for (var cur in debt) {
        if (!(cur in trustCount)) trustCount[cur] = 0;
        curname = cur;
        if (curname == "0158415500000000C1F76FF6ECB0BAC600000000") curname = "XAU";
        issuers.push({
            currency: curname,
            amount: comma(debt[cur]),
            trustlines: (trustCount[cur] + debtCount[cur]),
            depositor: debtCount[cur]
        });
    }
    freshNg("account",ngChangeDetector);
}

function procAccountOffers(data) {
    var rawoffers = data.offers;
    var prompt1, prompt2;
    var goodssize, moneysize;
    rawoffers.forEach(function(offer) {
        //console.log(offer);
        var taker_gets = offer.taker_gets;
        var taker_pays = offer.taker_pays;
        if (taker_gets.value && taker_pays.value) { //两者都不是XRP
            offers.push({
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
            offers.push({
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
            offers.push({
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
    });
    freshNg("account",ngChangeDetector);
}

function procTransactions(data) {
    var account = data.account;
    var transactions = data.transactions;
    transactions.forEach(function(transaction) {
        var tx = transaction.tx;
        tx.date = transaction.date;
        tx.hash = transaction.hash;
        var meta = transaction.meta;
        var TransactionType = tx.TransactionType;
        //console.log(transaction);
        //console.log(tx.Account);
        //console.log(account);
        //console.log(transaction,tx);
        switch (TransactionType) {
            case "OfferCreate":
                procOfferCreate(cur_address, tx, meta);
                break;
            case "Payment":
                procPayment(cur_address, tx, meta);
                break;
            case "TrustSet":
                procTrustSet(cur_address, tx, meta);
                break;
            case "OfferCancel":
                procOfferCancel(cur_address, tx, meta);
                break;
        }
    });
    freshNg("account",ngChangeDetector);
    //console.log("proc tx"+transactions.length);
}

function procTrustSet(cur_address, tx, meta) {
    if (tx.Account != cur_address) return;
    txs.push({
        "Sequence": tx.Sequence,
        "TransactionType": tx.TransactionType,
        "LimitAmount": tx.LimitAmount,
        "Fee": tx.Fee,
        "date": formatDate(tx.date),
        "txhash": tx.hash
    });
}

function procOfferCancel(cur_address, tx, meta) {
    if (tx.Account != cur_address) return;
    txs.push({
        "Sequence": tx.Sequence,
        "TransactionType": tx.TransactionType,
        "OfferSequence": tx.OfferSequence,
        "Fee": tx.Fee,
        "date": formatDate(tx.date),
        "txhash": tx.hash
    });
    var fill = {};
    fill.TransactionType = tx.TransactionType;
    fill.txhash = tx.hash;
    fill.date = formatDate(tx.date);
    fill.Sequence = tx.Sequence;
    var TXS = getTXS(tx.OfferSequence);
    TXS.cancel = true;
    TXS.classname = "cancel";
    TXS.fills.unshift(fill);
}

function procPayment(cur_address, tx, meta) {
    var amount = oktoAmount(tx.Amount, meta,cur_address);
    var type, prep, counterparty, Sequence;
    if (tx.Account == cur_address) { //本账户发送支付
        Sequence = tx.Sequence;
        if (tx.Destination === cur_address) {
            type = 'Exchange';
        } else {
            type = 'Send';
            prep = "to";
            counterparty = tx.Destination;
        }
    } else if (tx.Destination == cur_address) { ////本账户接收支付
        Sequence = "null";
        type = 'Receive';
        prep = "from";
        counterparty = tx.Account;
    } else { //该支付交易通过本账户的交易挂单完成的，加入offercreate filled数据中
        procAffectedNodes(cur_address, tx, meta);
        return;
    }
    txs.push({
        "Sequence": Sequence,
        "TransactionType": tx.TransactionType,
        "type": type,
        "prep": prep,
        "counterparty": counterparty,
        "amount": amount,
        "date": formatDate(tx.date),
        "txhash": tx.hash
    });
}

function getTXS(Sequence) {
    //	txs.forEach(function(tx){
    //		if(tx.Sequence==Sequence) return tx;//return 不能阻止forEach的循环
    //	});
    for (var i = 0; i < txs.length; i++) {
        if (txs[i].Sequence == Sequence) return txs[i];
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
    txs.push(tx);
    return tx;
}

function procOfferCreate(cur_address, tx, meta) {

    if (tx.Account == cur_address) { //本账户创建的offer

        var TXS = getTXS(tx.Sequence);
        TXS.TransactionType = tx.TransactionType;
        TXS.TakerGets = tx.TakerGets;
        TXS.TakerPays = tx.TakerPays;
        TXS.Fee = droptoxrp(tx.Fee);
        TXS.date = formatDate(tx.date);
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
        procAffectedNodes(cur_address, tx, meta);
    }
}

function procAffectedNodes(cur_address, tx, meta) {
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
                if (FinalFields.Account != cur_address) return; //未影响本账户Offer
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
                fill.date = formatDate(tx.date);
                break;
            case "RippleState": //IOU余额
                FinalFields = node[nodetype].FinalFields;
                if (!FinalFields) return;
                var LowLimit = FinalFields.LowLimit;
                if (!LowLimit) return;
                if (LowLimit.issuer != cur_address) return;
                fill.AccountBalance.push(FinalFields.Balance.value + FinalFields.Balance.currency);
                break;
            case "AccountRoot": //XRP余额
                FinalFields = node[nodetype].FinalFields;
                if (!FinalFields) return;
                if (FinalFields.Account != cur_address) return;
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
