import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { GlobalVariable } from '../global-variable';
declare var $: any;//declare var jQuery:any
declare var remote: any;
@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    constructor(
        private router: ActivatedRoute,
        private gv: GlobalVariable
    ) { }

    ngOnInit() {
        this.router.params.subscribe(params => {
            let args = params['args'];
            if (args === "0") {
                return;
            }
            this.account = args;
            this.rippleName(this.account);
        });
    }
    account;
    rippleName(address) {
        //console.log(address);
        $("#ripplename").html("loading");
        $.getJSON("https://id.ripple.com/v1/user/" + address, {}, function(res) {
            if (res.exists) {
                if (address[0] == '~') {
                    this.account = res.address;
                    //accountinfo(account);
                    //accountoffers(account);
                    //loadTXS();
                    //saveripplenameMap(res.address, res.username);
                    $("#ripplename").html(address);
                    return;
                }
                //saveripplenameMap(address, res.username);
                $("#ripplename").html("~" + res.username);
            } else {
                $("#ripplename").html("no ripple name");
            }
        });
    }
    accountinfo(account) {
        var req = remote.request('account_info', {
            account: account
        });
        req.request(function(err, res) {
            if (!err) {
                //$("#accountinfo").html(JSON.stringify(res));
                procAccountInfo(res);
                //  accountlines(account);
                //console.log(res);
            } else {
                $("#ripplename").html(err.error_message);
                //console.log(err);
                //console.log(res);
            }
        });
    }
    accountsetting = [];
    procAccountInfo(accountinfo) {
        var account_data = accountinfo.account_data;
      this.accountsetting = [];
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

}
