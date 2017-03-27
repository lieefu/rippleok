import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variable';
import { Router }   from '@angular/router';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    constructor(public gv: GlobalVariable, private router: Router) { }
    xid = "";
    ngOnInit() {
    }
    isActive(path: string) {
        //console.log(path,this.router.url);
        return this.router.url.indexOf(path) > -1;
    }
    isAdmin() {
        return false;
    }
    isLoggedIn() {
        return false;
    }
    getCurrentUser() {
        return {name:"world"};
    }
    menu = [];
  		//  [{
  		//   'title': 'Home',
  		//   'link': '/'
  		// }];
    isCollapsed = true;
    clickQuery = function() {
        if (!this.xid) return;
        let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        this.xid = this.xid.replace(rtrim, '');
        if (this.xid.length == 0) return;
        if (this.xid[0] == 'r' || this.xid[0] == '~') {
            this.router.navigate(['/account', this.xid]);
        } else if (this.xid.length > 15) {
            this.router.navigate(['/transaction', this.xid]);
        } else {
            this.router.navigate(['/ledger', this.xid]);
        }

    }
}
