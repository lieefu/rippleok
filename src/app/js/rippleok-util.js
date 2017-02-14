var Utils = ripple.utils;
var DATE_RIPPLE_START = new Date(2000, 0, 1);

function rippleDate(date) {
   console.log(date);
    var d = new Date(DATE_RIPPLE_START.getTime() - DATE_RIPPLE_START.getTimezoneOffset() * 60 * 1000 + date * 1000);
    return stringDate(d);
}
function formatDate(date) {
  return date.substring(0,date.indexOf("+"));
}

function stringDate(date) {
    //var year = date.getFullYear();
    //var month = date.getMonth() + 1;
    //var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    //return year + "/" + (month < 10 ? "0" + month : month) + "/"
    //      + (day < 10 ? "0" + day : day) + " "
    //   	+ (hour < 10 ? "0" + hour : hour) + ":"
    //      + (min < 10 ? "0" + min : min) + ":"
    //      + (sec < 10 ? "0" + sec : sec);
    return date.toLocaleDateString() + " " + twodigit(hour) + ":" + twodigit(min) + ":" + twodigit(sec);
}

function twodigit(num) {
    return num < 10 ? "0" + num : num;
}

function comma(x) {
    //console.log("x="+x+"parseFloat(x)="+parseFloat(x)+"parseFloat(x).toLocaleString()="+parseFloat(x).toLocaleString());
    return parseFloat(x).toLocaleString();
}

function ascify(code) {
    var str = '';
    for (i = 0; i < code.length; i = i + 2) {
        str = str + String.fromCharCode('0x' + code.substring(i, i + 2))
    }
    return str;
}

function droptoxrp(num) {
    return parseFloat(num) / 1000000;
}

function shortTX(tx) {
    return tx.substring(0, 6) + "...";
}

function shortAccount(account) {
    if (!account || account == "") return "";
    if (ripplenameMap[account]) {
        return ripplenameMap[account];
    } else {
        return account.substring(0, 6) + "...";
    }
}

function account2name(account) {
    if (ripplenameMap[account]) {
        return ripplenameMap[account];
    } else {
        return "";
    }
}
var ripplenameMap = {};

function initripplenameMap() {
    if (window.localStorage) {
        if (localStorage.ripplenameMap) {
            ripplenameMap = JSON.parse(localStorage.ripplenameMap);
        }
    }
}
initripplenameMap();

function saveripplenameMap(account, name) {
    if (account) ripplenameMap[account] = name;
    if (window.localStorage) {
        localStorage.ripplenameMap = JSON.stringify(ripplenameMap);
    }
}

function toAmount(amount, meta) {
    var amt = {
        value: 0,
        currency: '',
        issuer: ''
    };
    if (amount.currency) {
        amt.value = amount.value;
        amt.currency = amount.currency;
        amt.issuer = meta ? getIssuer(meta, amount) : amount.issuer;
    } else {
        amt.value = droptoxrp(amount);
        amt.currency = 'XRP';
        amt.issuer = '';
    }
    return amt;
}

function getIssuer(meta, amount) {
    for (i in meta.AffectedNodes) {
        var n = meta.AffectedNodes[i].ModifiedNode;
        if (n && n.LedgerEntryType === "RippleState" && n.FinalFields.HighLimit &&
            n.FinalFields.HighLimit.currency === amount.currency) {
            var high = n.FinalFields.HighLimit;
            var low = n.FinalFields.LowLimit;
            //if(high.issuer === account) return low.issuer;
            //else if(low.issuer === account) return high.issuer;
        }
    }
    return amount.issuer;
}

function getLang() {
    if (window.localStorage) {
        if (localStorage["language"]) return localStorage["language"];
    }
    return 0;
}

function saveLang(l) {
    if (window.localStorage) localStorage["language"] = l;
}
