import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variable';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    constructor(private gv: GlobalVariable) { }

    ngOnInit() {
    }
    setlang(value) {
        console.log(value);
        this.gv.lang = value;
        return false;
    }
}
