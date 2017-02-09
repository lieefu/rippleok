import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variable';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    constructor(private gv: GlobalVariable) { }

    ngOnInit() {
    }
    isActive(){
      return false;
    }
    isAdmin(){
      return false;
    }
    isLoggedIn(){
      return false;
    }
    getCurrentUser(){
      return {};
    }
    menu = [];
  		//  [{
  		//   'title': 'Home',
  		//   'link': '/'
  		// }];
      isCollapsed = true;
}
